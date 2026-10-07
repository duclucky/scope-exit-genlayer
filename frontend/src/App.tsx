import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { cancellationSet, ConfigurationError, phaseLabel, rightLabel, sameAddress } from './adapter';
import { createSDKAdapter } from './sdk-adapter';
import { ensureStudioNetwork } from './network';
import type { Agreement, ComponentId, ContractAdapter, OfferInput, TransactionProgress, WriteMethod } from './adapter';
import { connectWallet, discoverWallets } from './wallet';
import type { WalletChoice } from './wallet';

type Context = { adapter: ContractAdapter; account?: string; wallet?: WalletChoice; connect: () => void; disconnect: () => void; revision: number; reload: () => void };
const ProductContext = createContext<Context>(null!);
const useProduct = () => useContext(ProductContext);
const short = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;
const date = (seconds: number) => new Date(seconds * 1000).toLocaleString();
function Icon({ kind = 'arrow' }: { kind?: 'arrow' | 'cut' | 'wallet' | 'check' }) {
  const paths = { arrow: 'M5 12h14M13 6l6 6-6 6', cut: 'M9 9l11 11M9 15L20 4M7 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M7 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0', wallet: 'M3 7h17v13H3V4h14v3M15 11h6v5h-6z', check: 'M5 12l4 4L19 6' };
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]} /></svg>;
}
function Heading({ eyebrow, title, children, action }: { eyebrow: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <p className="lead">{children}</p>}</div>{action}</div>;
}
function Empty({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="empty panel"><span className="empty-icon"><Icon kind="cut" /></span><h2>{title}</h2><p>{children}</p>{action}</section>;
}
function useRead<T>(load: () => Promise<T>, dependencies: unknown[]) {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    setState(previous => ({ ...previous, loading: true, error: undefined }));
    load().then(data => { if (!cancelled) setState({ data, loading: false }); }).catch(error => { if (!cancelled) setState({ error: error instanceof Error ? error : new Error('The live read failed. Please try again.'), loading: false }); });
    return () => { cancelled = true; };
  }, dependencies);
  return state;
}
function ReadState({ loading, error, retry }: { loading: boolean; error?: Error; retry: () => void }) {
  if (loading) return <div className="panel skeleton" role="status">Reading your agreements…</div>;
  if (!error) return null;
  return <Empty title={error instanceof ConfigurationError ? 'Live agreements are not available yet' : 'We could not read the latest state'} action={error instanceof ConfigurationError ? <Link className="button secondary" to="/help">Understand the process</Link> : <button className="button" onClick={retry}>Try again</button>}>{error.message}</Empty>;
}
function WalletDialog({ open, choices, choose, close, error, busy }: { open: boolean; choices: WalletChoice[]; choose: (x: WalletChoice) => void; close: () => void; error?: string; busy: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; if (open && !dialog?.open) dialog?.showModal(); if (!open && dialog?.open) dialog.close(); }, [open]);
  return <dialog ref={ref} className="wallet-dialog" onCancel={close} aria-labelledby="wallet-title"><div className="dialog-header"><span className="eyebrow">Your choice, your wallet</span><button aria-label="Close wallet selection" className="icon-button" onClick={close}>×</button></div><h2 id="wallet-title">Connect a wallet</h2><p>Choose an extension detected in this browser. Connecting does not send a transaction.</p>{choices.length ? <div className="wallet-options">{choices.map(x => <button className="wallet-option" key={x.id} disabled={busy} onClick={() => choose(x)}><Icon kind="wallet" /><span>{x.name}</span><Icon /></button>)}</div> : <div className="notice">No EVM wallet was detected. Open this app in a browser with your wallet extension enabled, then reopen this picker.</div>}{busy && <p role="status">Approve the connection in your selected wallet…</p>}{error && <p className="error" role="alert">{error}</p>}<p className="small">ScopeExit uses Studio Dev. Transaction signing and network checks happen before a write.</p></dialog>;
}

export default function App() {
  const [wallets, setWallets] = useState<WalletChoice[]>([]);
  const [wallet, setWallet] = useState<WalletChoice>();
  const [account, setAccount] = useState<string>();
  const [picker, setPicker] = useState(false);
  const [walletError, setWalletError] = useState<string>();
  const [connecting, setConnecting] = useState(false);
  const [revision, setRevision] = useState(0);
  const [menu, setMenu] = useState(false);
  const adapter = useMemo(() => createSDKAdapter({ address: import.meta.env.VITE_CONTRACT_ADDRESS, account, provider: wallet?.provider }), [wallet, account]);
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => discoverWallets(window, setWallets), []);
  useEffect(() => { main.current?.focus(); setMenu(false); }, [location.pathname]);
  const disconnect = useCallback(() => { sessionStorage.removeItem('scopeexit-wallet-choice'); setWallet(undefined); setAccount(undefined); setMenu(false); setRevision(x => x + 1); }, []);
  useEffect(() => {
    const remembered = sessionStorage.getItem('scopeexit-wallet-choice');
    if (!remembered || account || wallet) return;
    const selected = wallets.find(x => x.id === remembered);
    if (!selected) return;
    let disposed = false;
    selected.provider.request({ method: 'eth_accounts' }).then(accounts => {
      if (!disposed && Array.isArray(accounts) && typeof accounts[0] === 'string' && /^0x[0-9a-f]{40}$/i.test(accounts[0])) { setWallet(selected); setAccount(accounts[0]); }
    }).catch(() => {});
    return () => { disposed = true; };
  }, [wallets, account, wallet]);
  useEffect(() => {
    if (!wallet) return;
    const changed = (...args: unknown[]) => {
      const accounts = args[0];
      if (!Array.isArray(accounts) || !accounts.length) disconnect();
      else if (typeof accounts[0] === 'string' && /^0x[0-9a-f]{40}$/i.test(accounts[0])) { setAccount(accounts[0]); setRevision(x => x + 1); }
      else disconnect();
    };
    const chainChanged = () => setRevision(x => x + 1);
    wallet.provider.on?.('accountsChanged', changed); wallet.provider.on?.('chainChanged', chainChanged);
    return () => { wallet.provider.removeListener?.('accountsChanged', changed); wallet.provider.removeListener?.('chainChanged', chainChanged); };
  }, [wallet, disconnect]);
  const choose = async (choice: WalletChoice) => {
    setConnecting(true); setWalletError(undefined);
    try { const identity = await connectWallet(choice); await ensureStudioNetwork(choice.provider); sessionStorage.setItem('scopeexit-wallet-choice', choice.id); setWallet(choice); setAccount(identity); setPicker(false); setRevision(x => x + 1); }
    catch { setWalletError('Connection was not approved or the wallet returned an invalid account. You can try again.'); }
    finally { setConnecting(false); }
  };
  const connect = () => { setWalletError(undefined); setPicker(true); };
  const value = { adapter, account, wallet, connect, disconnect, revision, reload: () => setRevision(x => x + 1) };
  return <ProductContext.Provider value={value}><a className="skip-link" href="#main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a><header className="site-header"><Link to="/" className="brand"><span className="brand-mark"><Icon kind="cut" /></span>ScopeExit</Link><nav aria-label="Main navigation">{[['/', 'Home'], ['/agreements', 'Agreements'], ['/activity', 'Activity'], ['/help', 'Help'], ['/account', 'Account']].map(([to, text]) => <NavLink end={to === '/'} key={to} to={to}>{text}</NavLink>)}</nav><div className="account-control">{account ? <><button className="button secondary account-button" onClick={() => setMenu(!menu)} aria-expanded={menu}>{short(account)} <span aria-hidden="true">⌄</span></button>{menu && <div className="account-menu"><p className="small">{wallet?.name}</p><p className="address">{account}</p><Link to="/account">Your account</Link><button onClick={disconnect}>Disconnect wallet</button></div>}</> : <button className="button secondary" onClick={connect}><Icon kind="wallet" />Connect wallet</button>}</div></header><div className="network-strip"><span className="status-dot" />Studio Dev<span className="network-note">{adapter.configured ? 'Live agreement service' : 'Deployment configuration pending — transactions disabled'}</span></div><main id="main" tabIndex={-1} ref={main}><Routes><Route path="/" element={<Home />} /><Route path="/agreements" element={<Agreements />} /><Route path="/new" element={<NewOffer />} /><Route path="/agreements/:id" element={<AgreementDetail />} /><Route path="/activity" element={<ActivityPage />} /><Route path="/account" element={<Account />} /><Route path="/help" element={<Help />} /><Route path="*" element={<Empty title="This page could not be found" action={<Link className="button" to="/agreements">Go to agreements</Link>}>Use the navigation to return to your work.</Empty>} /></Routes></main><footer><Link className="brand" to="/">ScopeExit</Link><p>Keep what stands on its own.</p><Link to="/help">Rights, refunds &amp; limits</Link></footer><WalletDialog open={picker} choices={wallets} choose={choose} close={() => setPicker(false)} error={walletError} busy={connecting} /></ProductContext.Provider>;
}

function Home() {
  return <><section className="hero"><div><p className="eyebrow">Conditional permissions. Clear exits.</p><h1>Let go of a part.<br /><span>Keep what stands.</span></h1><p className="lead">A bundle should not leave you guessing. Buy two permissions, understand their dependencies, and recover GEN for the unused parts you cancel.</p><div className="button-row"><Link className="button" to="/agreements">Explore agreements<Icon /></Link><Link className="button secondary" to="/new">Create an offer</Link></div><p className="small">Two permissions. 1 GEN each. Terms ratified by both parties.</p></div><div className="hero-illustration" aria-label="Illustration of a two-component permission bundle"><p className="eyebrow">An example, not a live purchase</p><div className="permission-example"><span className="example-number">A</span><div><h2>Analyze a record</h2><p>A permission with its own scope.</p></div><span>1 GEN</span></div><div className="connection-line"><span>Does the other right depend on it?</span></div><div className="permission-example"><span className="example-number">B</span><div><h2>Export the results</h2><p>Its terms determine whether it can stand alone.</p></div><span>1 GEN</span></div><div className="illustration-note"><Icon kind="check" /><p>Validators interpret the terms. The contract determines rights and exact refunds.</p></div></div></section><section className="section"><p className="eyebrow">A complete path, from offer to exit</p><h2>Make the next decision with clarity.</h2><div className="feature-grid">{[['01', 'Agree on the scope', 'Read both permissions and their expiry. The named buyer ratifies the exact terms when purchasing.'], ['02', 'Understand the dependencies', 'GenLayer reviews what each permission needs. Unclear terms keep funds waiting safely, with retry and expiry recovery.'], ['03', 'Use it or unwind it', 'Exercise a permission once, or cancel unused dependent parts and withdraw the refund. Independent rights stay available.']].map(([n, title, text]) => <article className="panel feature" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section><section className="callout"><div><h2>Your terms stay in view.</h2><p>Every agreement has a detail page, current rights and a history you can return to.</p></div><Link className="button accent" to="/help">See how it works<Icon /></Link></section></>;
}
function AgreementCard({ agreement: a }: { agreement: Agreement }) {
  const { account } = useProduct();
  return <Link className="agreement-card panel" to={`/agreements/${encodeURIComponent(a.id)}`}><div className="card-top"><span className="badge">{phaseLabel[a.phase]}</span><span className="small">{sameAddress(account, a.buyer) ? 'Your purchase' : sameAddress(account, a.issuer) ? 'Your offer' : 'Agreement'}</span></div><h2>{a.title}</h2><p>{a.permissions.map(p => p.title).join(' + ')}</p><div className="card-bottom"><span>2 GEN bundle</span><span>Expires {new Date(a.expiry * 1000).toLocaleDateString()}</span><Icon /></div></Link>;
}
function Agreements() {
  const { adapter, revision, reload, account } = useProduct();
  const state = useRead(() => adapter.list(), [adapter, revision]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = state.data?.filter(a => `${a.title} ${a.id} ${a.permissions.map(p => p.title).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (filter === 'all' || filter === 'mine' && (sameAddress(account, a.issuer) || sameAddress(account, a.buyer)) || filter === a.phase));
  return <><Heading eyebrow="Your work, in one place" title="Agreements" action={<Link className="button" to="/new">New offer<Icon /></Link>}>Find a purchase, revisit its terms, or finish your next step.</Heading><div className="filters"><label>Search agreements<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Title or agreement ID" /></label><label>Show<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All agreements</option><option value="mine">My agreements</option><option value="OFFERED">Awaiting purchase</option><option value="REVIEWED">Permissions ready</option><option value="CLOSED">Complete</option></select></label><button className="button secondary" onClick={reload}>Refresh</button></div><ReadState {...state} retry={reload} />{state.data && (filtered?.length ? <div className="agreement-grid">{filtered.map(a => <AgreementCard key={a.id} agreement={a} />)}</div> : <Empty title={state.data.length ? 'No matching agreements' : 'Your next agreement starts here'} action={<Link className="button" to="/new">Create an offer</Link>}>{state.data.length ? 'Try a different search or filter.' : 'Create two permission scopes for a named buyer, or return when an issuer has shared an agreement with you.'}</Empty>)}</>;
}
function TransactionBox({ progress }: { progress?: TransactionProgress }) {
  if (!progress) return null;
  return <div role={progress.stage === 'failed' ? 'alert' : 'status'} className={`transaction-box ${progress.stage === 'failed' ? 'error' : ''}`}><strong>{({ signing: 'Check your wallet', submitted: 'Transaction sent', accepted: 'Accepted — waiting for finalization', finalized: 'Confirmed', failed: 'Transaction failed' })[progress.stage]}</strong><p>{progress.message}</p>{progress.hash && <details><summary>Transaction reference</summary><code className="address">{progress.hash}</code></details>}</div>;
}
function useWrite() {
  const { adapter, account, reload } = useProduct();
  const [progress, setProgress] = useState<TransactionProgress>();
  const [busy, setBusy] = useState(false);
  const write = async (method: WriteMethod, args: unknown[], valueGEN: '0' | '1' | '2' = '0') => {
    if (!account || !adapter.configured || busy) return false;
    setBusy(true); setProgress({ stage: 'signing', message: 'Review and approve this action in your selected wallet.' });
    try { await adapter.write(method, args, valueGEN, setProgress); reload(); return true; }
    catch { setProgress(previous => previous?.stage === 'failed' ? previous : { stage: 'failed', message: 'The action was not confirmed successfully. Refresh the agreement before retrying; your canonical state determines what is available.' }); reload(); return false; }
    finally { setBusy(false); }
  };
  return { write, busy, progress };
}
function NewOffer() {
  const { adapter, account, connect } = useProduct();
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: `sx-${crypto.randomUUID().slice(0, 8)}`, title: '', buyer: '', titleA: '', termsA: '', titleB: '', termsB: '', expiry: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const tx = useWrite();
  const errorSummary = useRef<HTMLDivElement>(null);
  const change = (field: keyof typeof form, value: string) => { setForm(x => ({ ...x, [field]: value })); setReview(false); };
  const validate = () => {
    const e: Record<string, string> = {};
    for (const field of ['title', 'titleA', 'titleB', 'termsA', 'termsB'] as const) if (!form[field].trim()) e[field] = 'Enter this field before reviewing.';
    if (!/^0x[0-9a-f]{40}$/i.test(form.buyer)) e.buyer = 'Enter the buyer’s full EVM wallet address.';
    else if (sameAddress(form.buyer, account)) e.buyer = 'Choose a buyer different from the issuer.';
    const expiry = new Date(form.expiry).getTime();
    if (!Number.isFinite(expiry) || expiry <= Date.now() + 60000 || expiry > Date.now() + 30 * 86400000) e.expiry = 'Choose an expiry more than one minute and no more than 30 days from now.';
    setErrors(e); setReview(Object.keys(e).length === 0);
    if (Object.keys(e).length) setTimeout(() => errorSummary.current?.focus(), 0);
  };
  const publish = async () => {
    const input: OfferInput = { ...form, expiry: Math.floor(new Date(form.expiry).getTime() / 1000) };
    if (await tx.write('create_offer', [input.id, input.title, input.buyer, input.titleA, input.termsA, input.titleB, input.termsB, input.expiry])) navigate(`/agreements/${encodeURIComponent(input.id)}`);
  };
  const field = (key: keyof typeof form, label: string, multiline = false, type = 'text') => <div className="field"><label htmlFor={key}>{label}</label>{multiline ? <textarea id={key} value={form[key]} onChange={e => change(key, e.target.value)} maxLength={2000} rows={5} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} /> : <input id={key} type={type} value={form[key]} onChange={e => change(key, e.target.value)} maxLength={key === 'buyer' ? 42 : 80} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} />}{errors[key] && <span id={`${key}-error`} className="error">{errors[key]}</span>}</div>;
  return <><Heading eyebrow="For issuers" title="Create a permission offer">Define two scopes clearly. The named buyer will review and ratify these exact terms.</Heading><div className="form-layout"><section className="panel form-panel">{Object.keys(errors).length > 0 && <div className="notice error" tabIndex={-1} ref={errorSummary}><strong>Check the highlighted fields</strong><ul>{Object.entries(errors).map(([field, message]) => <li key={field}><a href={`#${field}`} onClick={e => { e.preventDefault(); document.getElementById(field)?.focus(); }}>{message}</a></li>)}</ul></div>}{field('title', 'Offer title')}{field('buyer', 'Buyer wallet address')}{field('expiry', 'Permission expiry (your local time)', false, 'datetime-local')}<div className="component-form"><span className="eyebrow">Permission A · 1 GEN</span>{field('titleA', 'Permission A name')}{field('termsA', 'Permission A terms', true)}</div><div className="component-form"><span className="eyebrow">Permission B · 1 GEN</span>{field('titleB', 'Permission B name')}{field('termsB', 'Permission B terms', true)}</div><button className="button secondary" onClick={validate}>Review offer<Icon /></button>{review && <div className="review-panel"><h2>Ready for a final check</h2><p><strong>{form.title}</strong> — {form.titleA} + {form.titleB}</p><p>Total purchase: <strong>2 GEN</strong>. Issuing this offer sends no purchase funds.</p><p>Buyer: <span className="address">{form.buyer}</span></p><p>Expires {date(Math.floor(new Date(form.expiry).getTime() / 1000))}. Terms become immutable when published.</p>{!account ? <button className="button" onClick={connect}>Connect to publish</button> : <button className="button" disabled={!adapter.configured || tx.busy} onClick={publish}>Publish offer</button>}{!adapter.configured && <p className="small">Deployment configuration is pending. Your draft is not an onchain offer.</p>}</div>}<TransactionBox progress={tx.progress} /></section><aside className="panel guidance"><span className="eyebrow">Write for clear decisions</span><h2>Say what each right needs.</h2><p>Describe the permission itself, any prerequisite on the other component, and whether it can stand alone.</p><p>For example: “Export is permitted only while analysis permission A remains active.”</p><p>These terms create rights inside ScopeExit. They do not certify external ownership or delivery.</p><Link to="/help">Terms and limits<Icon /></Link></aside></div></>;
}

function AgreementDetail() {
  const { id = '' } = useParams();
  const { adapter, revision, reload } = useProduct();
  const state = useRead(() => adapter.agreement(id), [adapter, revision, id]);
  return <><Link className="back-link" to="/agreements">← All agreements</Link><ReadState {...state} retry={reload} />{state.data && <AgreementContent agreement={state.data} refreshing={state.loading || !!state.error} />}</>;
}
function AgreementContent({ agreement: a, refreshing }: { agreement: Agreement; refreshing: boolean }) {
  const { adapter, account, connect } = useProduct();
  const tx = useWrite();
  const [exit, setExit] = useState<ComponentId>();
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now() / 1000), 1000); return () => clearInterval(timer); }, []);
  const buyer = sameAddress(account, a.buyer), issuer = sameAddress(account, a.issuer), party = buyer || issuer;
  const expired = now >= a.expiry;
  const reviewed = a.phase === 'REVIEWED' && !expired;
  const ready = adapter.configured && !!account && !tx.busy && !refreshing;
  const run = (method: WriteMethod, args: unknown[] = [a.id], value: '0' | '1' | '2' = '0') => tx.write(method, args, value);
  const closure = exit ? cancellationSet(a, exit) : [];
  const canCancel = (component: ComponentId) => cancellationSet(a, component).length > 0 && cancellationSet(a, component).every(id => a.permissions.find(x => x.id === id)?.status === 'ACTIVE');
  const canUse = (component: ComponentId) => {
    const index = component === 'A' ? 0 : 1;
    return a.permissions[index].status === 'ACTIVE' && (a.dependencies?.[index] === 'INDEPENDENT' || a.dependencies?.[index] === 'DEPENDENT' && a.permissions[1 - index].status === 'ACTIVE');
  };
  const credit = buyer ? a.buyerCreditGEN : issuer ? a.issuerCreditGEN : '0';
  return <><Heading eyebrow={expired && a.phase !== 'CLOSED' ? 'Permission window ended' : phaseLabel[a.phase]} title={a.title}>Review the exact scopes and your available next step.</Heading><div className="detail-layout"><section><div className="panel agreement-summary"><div><span className="small">Buyer</span><p className="address">{a.buyer}</p></div><div><span className="small">Issuer</span><p className="address">{a.issuer}</p></div><div><span className="small">Permission expiry</span><p>{date(a.expiry)}</p></div></div><div className="permissions">{a.permissions.map((p, index) => <article className="panel permission-card" key={p.id}><div className="card-top"><span className="component-letter">{p.id}</span><span className="badge">{rightLabel[p.status]}</span></div><h2>{p.title}</h2><p className="terms">{p.terms}</p><div className="permission-price">1 GEN</div>{a.dependencies && <p className="dependency-note">{a.dependencies[index] === 'DEPENDENT' ? `Needs permission ${index ? 'A' : 'B'} to remain active.` : a.dependencies[index] === 'INDEPENDENT' ? 'Can stand on its own.' : 'Dependency is not clear enough to act on.'}</p>}{buyer && reviewed && p.status === 'ACTIVE' && <div className="button-row"><button className="button" disabled={!ready || !canUse(p.id)} onClick={() => run('consume_component', [a.id, p.id])}>Use permission</button><button className="button secondary" disabled={!ready || !canCancel(p.id)} onClick={() => setExit(p.id)}>Cancel unused</button></div>}</article>)}</div>{exit && <section className="panel confirmation"><h2>Cancel {closure.map(id => a.permissions.find(p => p.id === id)?.title).join(' and ')}?</h2><p>{closure.length > 1 ? 'The other permission depends on this one, so both unused rights will be cancelled.' : 'The independent permission will keep its current state.'} This opens a <strong>{closure.length} GEN</strong> refund for the buyer.</p><p>The refund becomes available to withdraw after successful finalization.</p><div className="button-row"><button className="button danger" disabled={!ready || !canCancel(exit)} onClick={async () => { if (await run('exit_component', [a.id, exit])) setExit(undefined); }}>Confirm cancellation</button><button className="button secondary" onClick={() => setExit(undefined)}>Keep permissions</button></div></section>}<details className="panel technical"><summary>Verification details</summary><p>Agreement ID: <code>{a.id}</code></p><p>Exact terms digest: <code className="address">{a.digest}</code></p><p>Review attempts: {a.attempt}</p><p>These reads describe ScopeExit’s internal rights, not external service delivery.</p></details></section><aside><section className="panel next-step"><p className="eyebrow">Your next step</p><h2>{a.phase === 'OFFERED' ? 'Review before purchasing' : expired ? 'Recover what is unused' : ['FUNDED', 'RETRYABLE'].includes(a.phase) ? 'Understand your dependencies' : a.phase === 'CLOSED' ? 'All settled' : 'Choose what to keep'}</h2>{!account && <button className="button" onClick={connect}>Connect wallet</button>}{account && !party && <p>You are viewing this agreement. Only its buyer and issuer can take participant actions.</p>}{buyer && a.phase === 'OFFERED' && !expired && <><p>Accepting ratifies both exact scopes and deposits <strong>2 GEN</strong> into this agreement.</p><button className="button" disabled={!ready} onClick={() => run('accept_offer', [a.id, a.digest], '2')}>Accept for 2 GEN</button></>}{party && ['FUNDED', 'RETRYABLE'].includes(a.phase) && !expired && <><p>Review interprets prerequisites. Ambiguity keeps funds waiting safely. Up to three review attempts are allowed; unused funds remain recoverable at expiry.</p><button className="button" disabled={!ready || a.attempt >= 3} onClick={() => run('review_dependencies')}>{a.phase === 'RETRYABLE' ? 'Retry review' : 'Check dependencies'}</button></>}{expired && Number(a.escrowGEN) > 0 && a.phase !== 'CLOSED' && <><p>Unused permissions can no longer be exercised. Recovery opens their refund for the buyer.</p><button className="button" disabled={!ready} onClick={() => run('recover_expired')}>Recover unused funds</button></>}{issuer && a.phase === 'OFFERED' && <button className="button secondary" disabled={!ready} onClick={() => run('cancel_offer')}>Cancel offer</button>}{party && Number(credit) > 0 && <><p>Your available {buyer ? 'refund' : 'earnings'}: <strong>{credit} GEN</strong></p><button className="button" disabled={!ready} onClick={() => run('withdraw')}>Withdraw {credit} GEN</button></>}{party && a.permissions.every(p => ['CONSUMED', 'CANCELLED', 'EXPIRED'].includes(p.status)) && [a.escrowGEN, a.buyerCreditGEN, a.issuerCreditGEN].every(x => Number(x) === 0) && a.phase !== 'CLOSED' && <button className="button secondary" disabled={!ready} onClick={() => run('close')}>Finish agreement</button>}{!adapter.configured && <p className="small">Transactions are disabled until deployment is configured.</p>}<TransactionBox progress={tx.progress} /></section><div className="detail-note"><p>Funds held for unused permissions: <strong>{a.escrowGEN} GEN</strong></p><Link to="/help">How cancellation and refunds work</Link></div></aside></div></>;
}

function ActivityPage() {
  const { adapter, revision, reload } = useProduct();
  const state = useRead(() => adapter.history(), [adapter, revision]);
  return <><Heading eyebrow="Return with context" title="Activity">Follow confirmed agreement events and revisit the outcome.</Heading><ReadState {...state} retry={reload} />{state.data && (state.data.length ? <ol className="activity-list">{[...state.data].sort((a, b) => b.at - a.at).map(event => <li className="panel" key={event.id}><span className="timeline-dot" /><div><p className="small">{date(event.at)}</p><h2>{event.action}</h2><Link to={`/agreements/${encodeURIComponent(event.agreementId)}`}>{event.title}<Icon /></Link></div></li>)}</ol> : <Empty title="Your story is still ahead" action={<Link className="button" to="/agreements">Browse agreements</Link>}>Confirmed purchases, reviews and rights changes will appear here from canonical agreement history.</Empty>)}</>;
}
function Account() {
  const { adapter, account, wallet, connect, disconnect, revision, reload } = useProduct();
  const state = useRead(() => adapter.list(), [adapter, revision]);
  const credits = state.data?.filter(a => sameAddress(account, a.buyer) && Number(a.buyerCreditGEN) > 0 || sameAddress(account, a.issuer) && Number(a.issuerCreditGEN) > 0);
  return <><Heading eyebrow="Your identity & available funds" title="Account">Keep your wallet choice clear and finish pending refunds or earnings.</Heading><section className="panel identity-card"><div><p className="eyebrow">Selected wallet</p><h2>{wallet?.name ?? 'Not connected'}</h2><p className="address">{account ?? 'Connect a detected EVM wallet to see your role and take actions.'}</p></div>{account ? <button className="button secondary" onClick={disconnect}>Disconnect wallet</button> : <button className="button" onClick={connect}>Choose a wallet<Icon kind="wallet" /></button>}</section>{account && <><h2 className="section-title">Available refunds & earnings</h2><ReadState {...state} retry={reload} />{state.data && (credits?.length ? <div className="agreement-grid">{credits.map(a => <AgreementCard agreement={a} key={a.id} />)}</div> : <Empty title="No pending withdrawal">Confirmed refund or earnings credits will appear here. Open an agreement to withdraw the amount allocated to your wallet.</Empty>)}</>}<section className="panel account-info"><h2>What disconnecting does</h2><p>It clears ScopeExit’s selected provider and account and disables write actions until you reconnect. Your onchain agreements remain available. This app does not store wallet keys or use local storage as agreement state.</p></section></>;
}
function Help() {
  const questions = [
    ['What am I buying?', 'Two exact protocol-created permissions, priced at 1 GEN each. The issuer offers them to a named buyer; the buyer ratifies the same immutable terms when depositing 2 GEN. ScopeExit does not verify outside ownership, service delivery or legal enforceability.'],
    ['What does dependency review decide?', 'Validators interpret whether either permission needs the other to remain active. They compare meaning independently. The contract checks the complete result and derives cancellation scope and fixed accounting; a model cannot choose a payment amount or recipient.'],
    ['What happens when I cancel?', 'The selected unused permission and every unused permission that depends on it are cancelled together. Each cancelled slice opens a 1 GEN buyer refund. An independent slice remains available with its own escrow. Cancellation is blocked if it would invalidate an already used dependent permission.'],
    ['How do I use a permission?', 'The named buyer signs a one-time exercise before expiry while the right and required prerequisite are active. Its 1 GEN slice becomes issuer earnings. A consumer may check canonical rights to enforce its own integration; ScopeExit alone does not control outside systems.'],
    ['Why is a review waiting or retryable?', 'Unavailable evidence, ambiguous prerequisites or invalid model output cannot create a penalty or move purchase escrow. Reload the current agreement before retrying. If its permission window expires, recover all remaining unused funds instead.'],
    ['What happens at expiry?', 'At the exact expiry time or later, purchase, review, cancellation and exercise actions are late. Recovery returns every remaining unused slice to the buyer, even if the previous phase still says review pending. Existing credits remain withdrawable.'],
    ['How do withdrawals and finality work?', 'A refund or earnings credit is first recorded onchain. The credited wallet then withdraws through a real transaction. Sent or accepted does not mean completed: wait for finalized successful execution and a refreshed canonical read. Fees are quoted by the wallet/client; no simulated balance or fee is shown.'],
    ['Which wallet and network should I use?', 'Choose a detected EVM extension in the wallet picker. ScopeExit uses Studio Dev, chain 61997. Before a write, the selected provider must use the verified Studio Dev wallet chain. Read traffic uses the Intelligent Contract RPC through the configured path. Configuration failures remain visible.'],
  ];
  return <><Heading eyebrow="A clear path forward" title="Rights, refunds & limits">Understand the next step before signing it.</Heading><div className="help-layout"><section>{questions.map(([q, answer]) => <details className="panel help-question" key={q}><summary>{q}</summary><p>{answer}</p></details>)}</section><aside className="panel guidance"><h2>Ready to continue?</h2><p>Open an agreement to see its exact terms, current rights and eligible actions.</p><Link className="button" to="/agreements">Go to agreements<Icon /></Link><p className="small">Permission terminology is informed by the fixed <a href="https://www.w3.org/TR/2018/REC-odrl-model-20180215/" target="_blank" rel="noreferrer">W3C ODRL 2018 Recommendation</a>. Your ratified ScopeExit terms remain the authority for internal rights.</p></aside></div></>;
}
