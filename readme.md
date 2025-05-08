# Angular C# Flutter Ecommerce

**E-commerce** project built with a technology stack that includes **Angular** for web app, **C# ASP.NET CORE** for back end and **Flutter** for mobile development.

---

## Index

- [Description](#description)
- [Technology used](#technology-used)
- [Project structure](#project-structure)
- [How to install](#install)
- [Execute the project](#execute-project)
- [Tests](#tests)
- [Author](#author)

---

## Description

This project consists of an e-commerce application that allows users to browse products, add them to the cart and make purchases.

This project has:
- **Frontend web** developed with Angular and Tailwind CSS.
- **Backend API** built with ASP.NET CORE in C#.
- **Mobile app** developed with Flutter.

---

## Technology used

|   Technology          |   Description                                                 |
|:----------------------|:--------------------------------------------------------------|
|   **Angular**         | Frontend framework for SPA, API consumption, and responsive UI|
|   **ASP.NET CORE C#** | API RESTful to manage users, products and carts               |
|   **Flutter (Dart)**  | Mobile app for Android and IOS                                |
|   **PostgreSql**      | Database                                                      |

---

## Project structure

```
angular-csharp-ecommerce/
├──── Backend/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       ├── Interfaces/
│       ├── Repositories/
│       ├── Identity/
│       ├── Data/
│       ├── Constants/
│       ├── Hubs/
│       └── Program.cs
│
├──── Frontend/
│       └── src/
│            └── app/
│                 ├── core/
│                 ├── features/
│                 ├── shared/
│                 └── app.component
│
├──── mobile/
│        └── lib/
│              ├── models/
│              ├── screens/
│              ├── services/
│              ├── widgets/
│              └── main.dart
└── readme.md 
```

---

# How to install

For Backend:

```
cd Backend
dotnet restore
dotnet build
```

For Frontend:

```
cd Frontend
npm install
ng serve 
```

For mobile:

```
cd mobile
flutter pub get
flutter run
```

---

# Execute the project

For Backend:

```
dotnet run
```

For Frontend:

```
ng serve
```

For mobile:

```
flutter run
```

---

# Tests

For Backend:

```
dotnet test
```

For Frontend:

```
npm run test
```

For mobile (Not finish):

```
flutter test
```

---

# Author

**Gonzalo Juan Diez Buchanan**

[GitHub]('https://github.com/Gonzalo-diez')