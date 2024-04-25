export default function Layout({children, modal}) {
    return (
      <div>
        {modal}
        {children}
      </div>
    )
  }