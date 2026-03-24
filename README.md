# Fundify

Plataforma de inversión en fondos con arquitectura hexagonal, Angular 21 + JSON-Server.

## Características
- Gestión de fondos (suscripción, inversión)
- Balance dinámico con validaciones
- Historial transacciones con filtros/paginación
- Portafolio visual (gráficos torta)
- Responsive design (Material + Mobile-first)
- Estado reactivo (NgRx Signals)
- UI moderna (Angular Material 21)

## Tecnologías
- Frontend: Angular 21 • TypeScript 5.9 • RxJS 7.8
- Estado: @ngrx/signals 21
- UI: Angular Material 21
- Charts: ng2-charts 10 + Chart.js 4.5
- Backend: JSON-Server (Mock API)
- Estilo: SCSS + Prettier

## Inicio rápido
1. Clonar y Preparar

```bash
git clone https://github.com/JohanViancha/FUNDIFY.git
cd fundify
npm install
```

2. Backend JSON-Server
```bash
# Instalar depedencia
npm install json-server

# Usar
Crea archivo el db.json en la raíz

# Iniciar JSON Server
npx json-server db.json
```

3. Frontend Angular
```bash
# Iniciar
npm start
```

## Estructura Backend (db.json)
```json
{
  "balance": {
    "available": 500000,
    "hasMadeFirstTransaction": false,
    "lastUpdated": "2026-03-24T05:29:22.443Z"
  },
  "transactions": [],
  "funds": [
    {
      "id": "1",
      "name": "FPV_BTG_PACTUAL_RECAUDADORA",
      "minimumAmount": 75000,
      "category": "Fondo de Pensiones Voluntarias",
      "isSubscribed": false,
      "amountInvested": 0
    },
    {
      "id": "2",
      "name": "FPV_BTG_PACTUAL_ECOPETROL",
      "minimumAmount": 125000,
      "category": "Fondo de Pensiones Voluntarias",
      "isSubscribed": false,
      "amountInvested": 0
    },
    {
      "id": "3",
      "name": "DEUDAPRIVADA",
      "minimumAmount": 50000,
      "category": "Fondo de Inversión Colectiva",
      "isSubscribed": false,
      "amountInvested": 0
    },
    {
      "id": "4",
      "name": "FDO-ACCIONES",
      "minimumAmount": 250000,
      "category": "Fondo de Inversión Colectiva",
      "isSubscribed": false,
      "amountInvested": 0
    },
    {
      "id": "5",
      "name": " FPV_BTG_PACTUAL_DINAMICA",
      "minimumAmount": 100000,
      "category": "Fondo de Pensiones Voluntarias",
      "isSubscribed": false,
      "amountInvested": 0
    }
  ]
}
```

## Arquitectura
```mermaid
src/app/
├── layout/            # Layouts
├── shared/            # Reutilizables
│   ├── components/    # Componentes
│   └── domain/        # Modelos
│   └── directive/  
│   └── services/  
└── features/          # Fondos, Balance, Portfolio
    └── funds/
        ├── domain/         # Modelos
        ├── application/    # Casos de uso        
        ├── presentation/   # Componentes Paginas
        └── infrastructure/ # Repositorios

```

## Páginas
```mermaid
                | Ruta          | Descripción                       |
                | ------------- | --------------------------------- |
                | /funds        | Lista fondos + inversión          |
| /transactions | Historial de transcciones con filtros/paginación  |
| /portfolio    | Gráfico de distribución fondos y transaccuibes    |
```


## Pruebas unitarias

```bash
# Correr pruebas unitarias
npm run test 


## Generar cobertura de pruebas unitarias
npm run test:coverage 

```

## Construir aplicación

```bash
npm run build 
```

## Licencia
MIT License - Usa libremente.
