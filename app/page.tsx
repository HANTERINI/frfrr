"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Play, Square, Download, Settings, RefreshCw, Terminal, ExternalLink, Shield, Server, Activity } from 'lucide-react'

interface Profile {
  id: string
  name: string
  type: string
  local_ip: string
  local_port: number
  remote_port: number
  token: string
  status: 'active' | 'inactive'
}

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newProfile, setNewProfile] = useState<Partial<Profile>>({
    name: '',
    type: 'tcp',
    local_ip: '127.0.0.1',
    local_port: 8080,
    remote_port: 8080,
    token: Math.random().toString(36).substring(2, 15)
  })

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profiles')
      const data = await res.json()
      setProfiles(data || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const addProfile = async () => {
    if (!newProfile.name) return
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        body: JSON.stringify(newProfile)
      })
      setShowAdd(false)
      fetchProfiles()
    } catch (e) {
      console.error(e)
    }
  }

  const deleteProfile = async (id: string) => {
    try {
      await fetch(`/api/profiles?id=${id}`, { method: 'DELETE' })
      fetchProfiles()
    } catch (e) {
      console.error(e)
    }
  }

  const downloadConfig = (profile: Profile) => {
    const host = window.location.hostname
    const config = `[common]
server_addr = ${host}
server_port = 443
protocol = websocket
token = ${profile.token}
tls_enable = true

[${profile.name}]
type = ${profile.type}
local_ip = ${profile.local_ip}
local_port = ${profile.local_port}
remote_port = ${profile.remote_port}
`
    const blob = new Blob([config], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `frpc_${profile.name}.toml`
    a.click()
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-2 border-green-900 bg-green-950/10 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Terminal className="w-8 h-8" />
              FRP-FAST <span className="text-green-800 text-sm font-normal">VERCEL_EDITION v1.0</span>
            </h1>
            <p className="text-green-700 mt-1">Serverless Fast Reverse Proxy Manager</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setShowAdd(true)}
               className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-400 flex items-center gap-2 font-bold"
             >
               <Plus className="w-4 h-4" /> NEW_PROFILE
             </button>
             <button 
               onClick={fetchProfiles}
               className="border border-green-600 px-4 py-2 rounded hover:bg-green-900/30 flex items-center gap-2"
             >
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-green-900 p-4 rounded bg-green-950/5">
            <div className="text-green-800 flex items-center gap-2 mb-2"><Activity className="w-4 h-4"/> UPTIME</div>
            <div className="text-xl">99.9% (Serverless)</div>
          </div>
          <div className="border border-green-900 p-4 rounded bg-green-950/5">
            <div className="text-green-800 flex items-center gap-2 mb-2"><Server className="w-4 h-4"/> PROFILES</div>
            <div className="text-xl">{profiles.length} Total</div>
          </div>
          <div className="border border-green-900 p-4 rounded bg-green-950/5">
            <div className="text-green-800 flex items-center gap-2 mb-2"><Shield className="w-4 h-4"/> SECURITY</div>
            <div className="text-xl text-yellow-500">WSS_ENABLED</div>
          </div>
        </div>

        {/* List */}
        <div className="border border-green-900 rounded overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-green-900/20 text-green-700">
              <tr>
                <th className="p-4">NAME</th>
                <th className="p-4">TYPE</th>
                <th className="p-4">LOCAL</th>
                <th className="p-4">REMOTE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-green-800">NO PROFILES FOUND. CREATE ONE TO START TUNNELING.</td>
                </tr>
              ) : (
                profiles.map(p => (
                  <tr key={p.id} className="border-t border-green-900/50 hover:bg-green-900/10 transition-colors">
                    <td className="p-4 font-bold">{p.name}</td>
                    <td className="p-4 text-sm">{p.type.toUpperCase()}</td>
                    <td className="p-4 text-sm">{p.local_ip}:{p.local_port}</td>
                    <td className="p-4 text-sm">{p.remote_port}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => downloadConfig(p)} title="Download Config" className="p-2 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
                      <button onClick={() => deleteProfile(p.id)} title="Delete" className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info */}
        <div className="bg-green-950/10 border border-green-900/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
            <Settings className="w-5 h-5" /> SETUP INSTRUCTIONS
          </h2>
          <div className="space-y-4 text-green-700 text-sm">
            <div>
              <p className="font-bold text-green-500 mb-1">1. Install FRP Client</p>
              <code className="block bg-black p-2 rounded border border-green-900">
                curl -L "https://github.com/fatedier/frp/releases/download/v0.54.0/frp_0.54.0_linux_amd64.tar.gz" -o frp.tar.gz
              </code>
            </div>
            <div>
              <p className="font-bold text-green-500 mb-1">2. Download Configuration</p>
              <p>Click the download icon in the table above to get your <span className="text-green-400">frpc.toml</span> file.</p>
            </div>
            <div>
              <p className="font-bold text-green-500 mb-1">3. Start Tunneling</p>
              <code className="block bg-black p-2 rounded border border-green-900">
                ./frpc -c frpc.toml
              </code>
            </div>
            <div className="pt-4 border-t border-green-900/30">
              <p className="italic underline decoration-green-900">Note: This version uses WebSockets to bypass VPS requirements. Traffic is proxied through Vercel Edge.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-black border-2 border-green-500 p-8 rounded-lg max-w-md w-full space-y-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <h3 className="text-2xl font-bold border-b border-green-900 pb-2">CREATE_PROFILE</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-green-800 block mb-1">NAME</label>
                <input 
                  type="text" 
                  value={newProfile.name}
                  onChange={e => setNewProfile({...newProfile, name: e.target.value})}
                  className="w-full bg-black border border-green-900 p-2 text-green-400 focus:outline-none focus:border-green-500"
                  placeholder="e.g. myservice"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-green-800 block mb-1">LOCAL_PORT</label>
                  <input 
                    type="number" 
                    value={newProfile.local_port}
                    onChange={e => setNewProfile({...newProfile, local_port: parseInt(e.target.value)})}
                    className="w-full bg-black border border-green-900 p-2 text-green-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-800 block mb-1">REMOTE_PORT</label>
                  <input 
                    type="number" 
                    value={newProfile.remote_port}
                    onChange={e => setNewProfile({...newProfile, remote_port: parseInt(e.target.value)})}
                    className="w-full bg-black border border-green-900 p-2 text-green-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-green-800 block mb-1">TYPE</label>
                <select 
                  value={newProfile.type}
                  onChange={e => setNewProfile({...newProfile, type: e.target.value})}
                  className="w-full bg-black border border-green-900 p-2 text-green-400"
                >
                  <option value="tcp">TCP</option>
                  <option value="http">HTTP (Recommended)</option>
                  <option value="https">HTTPS</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={addProfile}
                className="flex-1 bg-green-600 text-black font-bold py-2 rounded hover:bg-green-500"
              >
                SAVE
              </button>
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 border border-green-900 py-2 rounded hover:bg-green-900/20"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
