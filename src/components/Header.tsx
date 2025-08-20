export function Header() {
  return (
    <header className="w-full bg-neutral-50 text-sky-900 p-4 shadow-md pl-44 pr-44 h-30">
      <div className="container mx-auto px-4 pt-2 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">Sistema de Rodízio CCB</h1>
            <p className="text-muted-foreground mt-1">Gerenciamento de organistas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Congregação Cristã no Brasil</p>
            </div>
          </div>
        </div>
      </div>
  </header>
    
  )
}
//mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8