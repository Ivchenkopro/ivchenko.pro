"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, RefreshCw, Filter, WifiOff } from "lucide-react";

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  details: string;
  created_at: string;
}

export default function LogsTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (filter !== "all") {
        query = query.eq('entity', filter);
      }

      const { data, error } = await query;
        
      if (error) throw error;
      if (data) {
        setLogs(data);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error("Error fetching logs:", err);
      // In local mode, we just show empty logs or a message, not an error
      setIsDemoMode(true);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'login': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Журнал действий</h2>
        <div className="flex gap-2 items-center">
            {isDemoMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 mr-2">
                <WifiOff className="w-3 h-3" />
                Локальный режим
            </span>
            )}
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-black text-sm"
          >
            <option value="all">Все сущности</option>
            <option value="announcement">Объявления</option>
            <option value="settings">Настройки</option>
            <option value="link">Ссылки</option>
            <option value="auth">Вход</option>
          </select>
          <button
            onClick={fetchLogs}
            className="p-2 border rounded-lg hover:bg-gray-50 bg-white text-black"
            title="Обновить"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
        </div>
      )}

      {isDemoMode ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
            <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Журнал действий недоступен в локальном режиме</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-3">Действие</th>
                    <th className="px-6 py-3">Сущность</th>
                    <th className="px-6 py-3">Детали</th>
                    <th className="px-6 py-3">Время</th>
                </tr>
                </thead>
                <tbody>
                {loading && logs.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                    </td>
                    </tr>
                ) : logs.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Записей не найдено
                    </td>
                    </tr>
                ) : (
                    logs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                        </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                        {log.entity}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={log.details}>
                        {log.details}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {formatDate(log.created_at)}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
      )}
    </div>
  );
}
