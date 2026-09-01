"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Users, WifiOff, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the 3D map so it only renders on the client
const IndiaMap3D = dynamic(() => import('@/components/3d/IndiaMap3D'), { ssr: false });

export default function CommandCenterPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="container mx-auto max-w-7xl py-24 px-4 md:px-6 min-h-screen relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/50">SUPERVISOR</Badge>
          <div className="flex items-center text-xs text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            LIVE SYSTEM
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white glow-text uppercase">
          Command Center
        </h1>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10"
      >
        {/* Top KPI Cards */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel border-white/5 h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex justify-between">
                Completion Rate
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">82.4%</div>
              <p className="text-xs text-emerald-400 mt-1">+2.1% from yesterday</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-panel border-white/5 h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex justify-between">
                Households Verified
                <Users className="w-4 h-4 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">12.4M</div>
              <p className="text-xs text-purple-400 mt-1">Across 28 states</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-panel border-white/5 h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex justify-between">
                Data Quality Score
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">96.8%</div>
              <p className="text-xs text-emerald-400 mt-1">Based on AI validation</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Main 3D Map Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-panel border-white/5 h-full min-h-[500px] overflow-hidden flex flex-col">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center space-x-2 text-white">
                <span>Interactive 3D Enumeration Map</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow relative bg-[#020617]/50">
              <IndiaMap3D />
              
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/5">
                <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Status Legend</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Complete ({'>'}90%)</div>
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> In Progress (20-90%)</div>
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Pending ({'<'}20%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Panel: Alerts & Network */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* AI Data Quality Alerts */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel border-red-500/20 bg-red-950/10 h-full">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-semibold flex items-center text-red-400">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  AI Data Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-white">128</span>
                  <span className="text-sm text-red-400">records need verification</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                    <span className="text-zinc-300">Age/Marital Mismatch</span>
                    <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">42</Badge>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                    <span className="text-zinc-300">Duplicate Households</span>
                    <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">15</Badge>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                    <span className="text-zinc-300">Location Anomalies</span>
                    <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">71</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Offline Sync Status */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel border-yellow-500/20 bg-yellow-950/10 h-full">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-semibold flex items-center text-yellow-400">
                  <WifiOff className="w-4 h-4 mr-2" />
                  Offline Sync Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-white">342</span>
                  <span className="text-sm text-yellow-400">records waiting</span>
                </div>
                <p className="text-xs text-zinc-400">Waiting for enumerators in remote areas to regain network connectivity.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enumerator Network */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel border-blue-500/20 bg-blue-950/10 h-full">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-semibold flex items-center text-blue-400">
                  <Users className="w-4 h-4 mr-2" />
                  Enumerator Network
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-white">12,482</span>
                  <span className="text-sm text-blue-400">active field agents</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 text-right">65% of target deployed</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
