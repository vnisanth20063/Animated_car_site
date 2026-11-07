import { Link, useSearchParams } from 'react-router-dom';
import { packages } from '../data/packages';
import PackageCard from '../components/PackageCard';

export default function Packages() {
  const [params] = useSearchParams();
  const drafts = params.get('preview') === 'drafts';
  const list = packages.filter((p) => p.approved || drafts);
  return (
    <main className="section pb-10 pt-32">
      <h1 className="headline text-[clamp(2rem,6vw,5rem)]">Packages</h1>
      <p className="mt-4 max-w-xl text-mist">Approved service combinations from ARS. Package names and prices are set by ARS.</p>
      {list.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-10">
          <p className="text-lg font-semibold">No packages published yet</p>
          <p className="mt-2 max-w-lg text-mist">Choose individual services and ARS will quote them together.</p>
          <Link to="/services" className="btn-primary mt-6">Choose services</Link>
        </div>
      )}
    </main>
  );
}
