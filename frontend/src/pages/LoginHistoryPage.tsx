import React, { useEffect, useState } from 'react';
import { getMyLoginHistory } from '../api/userApi';
import type { LoginHistory, PagedResult } from '../types/User';
import type { LoginHistoryQuery } from '../api/userApi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PAGE_SIZE = 20;
const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILURE', label: 'Failure' },
];
const INTERVALS = [
  { value: 'week', label: '1 week' },
  { value: 'month', label: '1 month' },
  { value: 'year', label: '1 year' },
];

// JST値として表示する関数
const toJST = (dt: string) => {
  if (!dt) return '';
  const jstDate = new Date(dt);
  jstDate.setHours(jstDate.getHours() + 9);
  return jstDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
};

// グラフ用データ生成
function aggregateHistory(history: LoginHistory[], interval: string) {
  if (history.length === 0) return [];
  // loginAt昇順でソート
  const sorted = [...history].sort((a, b) => a.loginAt.localeCompare(b.loginAt));
  const result: { label: string; count: number }[] = [];
  const format = (date: Date) => {
    if (interval === 'week') return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
    if (interval === 'month') return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    if (interval === 'year') return `${date.getFullYear()}/${date.getMonth() + 1}`;
    return '';
  };
  const map = new Map<string, number>();
  for (const h of sorted) {
    const d = new Date(h.loginAt);
    d.setHours(d.getHours() + 9); // JST補正
    let key = '';
    if (interval === 'week') {
      key = format(d); // 時間単位
    } else if (interval === 'month') {
      key = format(d); // 日単位
    } else if (interval === 'year') {
      key = format(d); // 月単位
    }
    map.set(key, (map.get(key) || 0) + 1);
  }
  for (const [label, count] of map.entries()) {
    result.push({ label, count });
  }
  // ラベル昇順
  result.sort((a, b) => a.label.localeCompare(b.label));
  return result;
}

const LoginHistoryPage: React.FC = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [interval, setInterval] = useState<'week' | 'month' | 'year'>('week');

  const fetchHistory = async (params: LoginHistoryQuery = {}) => {
    setLoading(true);
    try {
      const res: PagedResult<LoginHistory> = await getMyLoginHistory({
        page,
        size: PAGE_SIZE,
        status,
        from: from || undefined,
        to: to || undefined,
        ...params,
      });
      setLoginHistory(res.items);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [page, status, from, to]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory({ page: 1 });
  };

  // グラフ用データ
  const chartData = aggregateHistory(loginHistory, interval);

  return (
    <div>
      <h1>Login History</h1>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span>Graph Interval:</span>
          {INTERVALS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setInterval(opt.value as 'week' | 'month' | 'year')}
              style={{ fontWeight: interval === opt.value ? 'bold' : undefined }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Login Attempts" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <form onSubmit={handleFilter} style={{ marginBottom: 16, marginTop: 40, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <label>Status:
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ marginLeft: 4 }}>
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <label>From:
          <input type="datetime-local" value={from} onChange={e => setFrom(e.target.value)} />
        </label>
        <label>To:
          <input type="datetime-local" value={to} onChange={e => setTo(e.target.value)} />
        </label>
        <button type="submit">Filter</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
            <thead style={{ background: '#f5f5f5' }}>
              <tr>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Date (JST)</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>IP</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 16 }}>No history found.</td></tr>
              ) : (
                loginHistory.map((h) => (
                  <tr key={h.id}>
                    <td style={{ padding: 8 }}>{toJST(h.loginAt)}</td>
                    <td style={{ padding: 8 }}>{h.loginStatus}</td>
                    <td style={{ padding: 8 }}>{h.ipAddress}</td>
                    <td style={{ padding: 8, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.userAgent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginHistoryPage; 