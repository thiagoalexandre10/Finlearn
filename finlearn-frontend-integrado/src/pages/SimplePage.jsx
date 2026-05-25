import PageHeader from '../components/PageHeader';
import { Card, SectionTitle } from '../components/Card';

export default function SimplePage({ title, subtitle, children }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="page-container">
        {children || (
          <Card>
            <SectionTitle title={title} />
            <p>Esta tela está pronta para receber novas funcionalidades do backend.</p>
          </Card>
        )}
      </div>
    </>
  );
}
