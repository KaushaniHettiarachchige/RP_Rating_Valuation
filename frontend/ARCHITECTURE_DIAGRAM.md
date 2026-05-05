# Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.jsx (Main)                         │
│                                                                 │
│  • useState: activeTab                                          │
│  • Renders: Header, Footer, Navigation, Active Page            │
│                                                                 │
└──────────────┬────────────────────────────┬─────────────────────┘
               │                            │
       ┌───────▼────────┐          ┌────────▼────────┐
       │  ResidentPortal │          │ CouncilDashboard│
       │   (Page)        │          │    (Page)       │
       └───────┬─────────┘          └────────┬────────┘
               │                             │
    ┌──────────┴──────────┐      ┌──────────┴──────────┐
    │                     │      │                     │
┌───▼──────┐      ┌───────▼──┐   │   ┌───▼──────┐    │
│ useState  │      │ Business │   │   │ useState  │    │
│          │      │  Logic   │   │   │          │    │
│ • pId     │      │          │   │   │ • form    │    │
│ • Data    │      │ • verify │   │   │ • status  │    │
│ • Error   │      │ • corrupt│   │   │ • loading │    │
│ • Loading │      │ • reset  │   │   └───────────┘    │
│ • History │      │          │   │                     │
└───────────┘      └──────────┘   │   ┌───────────┐    │
                                  │   │ Business  │    │
                                  │   │  Logic    │    │
                                  │   │           │    │
                                  │   │ • submit  │    │
                                  │   │ • calc    │    │
                                  │   └───────────┘    │
               │                             │
       ┌───────▼────────────────────┬────────▼─────────┐
       │                            │                  │
┌──────▼────────┐          ┌────────▼───────┐  ┌─────▼──────┐
│   constants/  │          │  components/   │  │ External   │
│               │          │                │  │ Libraries  │
├───────────────┤          ├────────────────┤  ├────────────┤
│ • config.js   │          │ • Button.jsx   │  │ • ethers   │
│   - ADDRESS   │          │ • InputField   │  │ • axios    │
│   - URL       │          │ • SelectField  │  │ • QRCode   │
│   - ABI       │          │ • Alert        │  │            │
└───────────────┘          │ • LoadingSkel  │  └────────────┘
                           │ • DataCard     │
                           │ • Header       │
                           │ • Footer       │
                           └────────────────┘


DATA FLOW:

1. USER INTERACTION
   User → Button Click → Event Handler

2. STATE UPDATE
   Event Handler → setState → Component Re-render

3. SIDE EFFECTS
   useEffect → API Call/Blockchain → Update State

4. COMPONENT RENDERING
   State → Conditional Rendering → UI Update


COMPONENT HIERARCHY:

App
├── Header (imported component)
├── Navigation Buttons (inline JSX)
├── ActivePage (conditional render)
│   ├── ResidentPortal
│   │   ├── Button (imported)
│   │   ├── InputField (imported)
│   │   ├── Alert (imported)
│   │   ├── LoadingSkeleton (imported)
│   │   ├── DataCard (imported)
│   │   └── QRCode (external library)
│   │
│   └── CouncilDashboard
│       ├── Button (imported)
│       ├── InputField (imported)
│       ├── SelectField (imported)
│       ├── DataCard (imported)
│       └── Alert (imported)
│
└── Footer (imported component)


IMPORT DEPENDENCY GRAPH:

                    ┌─────────────┐
                    │  App.jsx    │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼───────┐  ┌───▼────┐  ┌─────▼──────┐
    │ ResidentPortal│  │ Header │  │CouncilDash │
    └───────┬───────┘  └────┬───┘  └─────┬──────┘
            │               │            │
    ┌───────┼───────────────┼────────────┼───────┐
    │       │               │            │       │
┌───▼──┐ ┌──▼─────┐ ┌──────▼────┐ ┌────▼───┐ ┌─▼────┐
│Button│ │InputFld│ │ LoadingSke│ │DataCard│ │Alert │
└──────┘ └────────┘ └───────────┘ └────────┘ └──────┘
    │       │               │            │       │
    └───────┼───────────────┼────────────┼───────┘
            │               │            │
        ┌───▼───────────────▼────────────▼───┐
        │         config.js                  │
        │  • CONTRACT_ADDRESS                │
        │  • BACKEND_URL                     │
        │  • CONTRACT_ABI                    │
        └────────────────────────────────────┘


FILE SIZE BREAKDOWN:

┌─────────────────────────────────────────┐
│ Before: 1 File                          │
│ ═══════════════════════════════════════ │
│ App.jsx                   1,328 lines   │
│                                         │
│ Total:                    1,328 lines   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ After: 13 Files                         │
│ ═══════════════════════════════════════ │
│ App.jsx                       82 lines  │
│ config.js                    230 lines  │
│ Button.jsx                    45 lines  │
│ InputField.jsx                25 lines  │
│ SelectField.jsx               25 lines  │
│ Alert.jsx                     35 lines  │
│ LoadingSkeleton.jsx           15 lines  │
│ DataCard.jsx                  25 lines  │
│ Header.jsx                    40 lines  │
│ Footer.jsx                    25 lines  │
│ ResidentPortal.jsx           450 lines  │
│ CouncilDashboard.jsx         280 lines  │
│                                         │
│ Total:                    ~1,277 lines  │
└─────────────────────────────────────────┘


KEY PRINCIPLES APPLIED:

1. ✅ Single Responsibility Principle
   Each component has ONE clear purpose

2. ✅ DRY (Don't Repeat Yourself)
   Reusable components eliminate duplication

3. ✅ Separation of Concerns
   Business logic, UI, and data separated

4. ✅ Component Composition
   Build complex UIs from simple components

5. ✅ Props Drilling Minimized
   Keep data flow simple and direct

6. ✅ Maintainability
   Easy to find, understand, and modify code

7. ✅ Scalability
   Add features without touching existing code

8. ✅ Testability
   Each unit can be tested in isolation
```
