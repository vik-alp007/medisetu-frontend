import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Bare Layout for full-screen pages like Splash
 */
export const BareLayout = () => {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] via-[#EAF3FF] to-[#D8EBFF]">
      <Outlet />
    </main>
  );
};

export default BareLayout;
