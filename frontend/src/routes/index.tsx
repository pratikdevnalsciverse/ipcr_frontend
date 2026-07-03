import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/home';
import Initialization from '../pages/initialization/initialization';
import Login from '../pages/login/login';
import IDEntry from '../pages/idEntry/idEntry';
import SampleType from '../pages/sampleType/sampleType';
import MainLayout from '../layouts/MainLayout';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Initialization />} />
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/id-entry" element={<IDEntry />} />
        <Route path="/sample-type" element={<SampleType />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

