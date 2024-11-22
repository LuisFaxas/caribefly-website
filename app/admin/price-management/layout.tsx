import './styles.css'

export default function PriceManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="price-management-theme">{children}</div>
}
