Sejuk-Sejuk Service Web App ( https://sejuk-sejuk-service-1.web.app/ )

📖 Overview

Sejuk-Sejuk Service is a web-based service management system for an air-conditioning service company.
It helps admins assign service orders (tickets) to technicians, while technicians can view, update, and complete assigned tasks in real time.

The app has three main parts:

- Home Page – entry point with options to log in as Admin or Technician.

Module 1 - Admin Portal – create and assign service orders, track job progress.

Module 2 - Technician Portal – view assigned tasks, update job status, upload proof (images).

⚙️ Tech Stack

- Frontend: React.js
- Routing: React Router
- Auth & Database: Firebase Authentication & Firestore
- Image Upload: Cloudinary
- Hosting: Firebase Hosting

🚀 Features

- Secure login for Admins and Technicians (Firebase Auth).
> Admin 
~email : admin@sejuk.com
~password : adminsejuk

>technician
~email : technician@sejuk.com
~password : techniciansejuk

- Admin dashboard to create and assign service tickets.
- Technician dashboard to view and update assigned tasks.
- Real-time updates with Firestore.
- Image upload support via Cloudinary.
- Role-based navigation with a shared Navbar.

🔥 Challenges & Learnings

- Firebase Storage billing issue - switched to Cloudinary for image uploads.
- UI/UX design was tricky - needed to make it simple but functional.
- Ensuring real-time task updates between Admin and Technician portals.

💡 Assumptions

- Only two roles: Admin and Technician.
- Admin manages orders; technicians can only update their own tasks.
- Accounts are added manually in Firebase Authentication (email & password).

🎯 Future Improvements

- Add notifications (email/WhatsApp) for new assignments/Completed job.
- Improve UI with dashboards and progress tracking.
- Generate reports for completed tasks.
- Add more roles.

📝 Optional Self-Assessment

Which part was easiest?

The easiest part for me was designing the project flow and logic. Specifically, how the admin creates a ticket/order and assigns it to a technician, and how the technician can view their assigned tasks, complete them, and report updates. The workflow from both perspectives felt clear and straightforward to implement.

Any parts you skipped or need help with?

I skipped setting up Firebase Storage because I had issues with the billing setup. Instead, I switched to using Cloudinary for image uploads. I also need more help with UI design, as I’m not very confident in making the website look modern or visually appealing. Another challenge I faced was linking the admin and technician dashboards so that both sides receive real-time updates on task status.

In a real project, which area are you most confident handling?

I feel most confident in planning and managing the project flow, what the users will see, how the system should behave, and setting up the base structure of the project. I can design a clear workflow for different user roles (admin and technician) and ensure the main functionality works as expected.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
