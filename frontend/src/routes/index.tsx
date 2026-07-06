import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/home';
import Initialization from '../pages/initialization/initialization';
import Login from '../pages/login/login';
import IDEntry from '../pages/idEntry/idEntry';
import SampleType from '../pages/sampleType/sampleType';
import SampleEntry from '../pages/sampleEntry/sampleEntry';
import SamplePreview from '../pages/samplePreview/samplePreview';
import InsertCartridge from '../pages/insertCartridge/insertCartridge';
import RunPage from '../pages/run/run';
import ThermalProfilePage from '../pages/thermalProfile/thermalProfile';
import ImpedanceProfilePage from '../pages/impedanceProfile/impedanceProfile';
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
        <Route path="/sample-entry" element={<SampleEntry />} />
        <Route path="/sample-preview" element={<SamplePreview />} />
        <Route path="/insert-cartridge" element={<InsertCartridge />} />
        <Route path="/run" element={<RunPage />} />
        <Route path="/ThermalProfilePage" element={<ThermalProfilePage />} />
        <Route path="/ImpedenceProfile" element={<ImpedanceProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

