import React from 'react';
//import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { WorklogsContextProvider } from './context/WorklogsContext'
import { AuthContextProvider } from './context/AuthContext'

const root = createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <WorklogsContextProvider>
        <App />
      </WorklogsContextProvider>
    </AuthContextProvider>
);