"use client";

import { countAllUsers } from "@/app/actions/db";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { name: "Jan", downloads: 400 },
  { name: "Feb", downloads: 300 },
  { name: "Mar", downloads: 600 },
  { name: "Apr", downloads: 800 },
  { name: "May", downloads: 500 },
  { name: "Jun", downloads: 700 },
];

export function AdminDashboard() {
  type Data = {
    totalBeats: number;
    downloads: {
      monthlyDownloadsData: any;
      totalDownloads: number;
    };
    activeUser: number;
  };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;
  const [data, setData] = useState<Data | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

        // Get total beats count
        const { count: totalBeats, error: beatsError } = await supabase
          .from("beats")
          .select("*", { count: "exact", head: true });

        if (beatsError) throw beatsError;

        // Get total downloads and monthly breakdown
        const { data: downloadsData, error: downloadsError } = await supabase
          .from("downloads")
          .select("downloaded_at")
          .gte("downloaded_at", startOfYear.toISOString())
          .order("downloaded_at", { ascending: true });

        if (downloadsError) throw downloadsError;

        // Get active users (active in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const users = await countAllUsers();
        // Process monthly downloads data
        const monthlyDownloads = new Array(12).fill(0);
        downloadsData.forEach((download) => {
          const downloadDate = new Date(download.downloaded_at);
          monthlyDownloads[downloadDate.getMonth()]++;
        });

        const monthlyDownloadsData = months.map((name, index) => ({
          name,
          downloads: monthlyDownloads[index],
        }));

        setData({
          totalBeats: totalBeats || 0,
          downloads: {
            monthlyDownloadsData,
            totalDownloads: downloadsData.length,
          },
          activeUser: users || 10,
        });
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  });

  console.log(data);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-zinc-950 border-[#39FF14]/10">
          <h3 className="text-sm font-medium text-gray-400">Total Downloads</h3>
          <p className="text-2xl font-bold text-white mt-2">
            {data?.downloads.totalDownloads}
          </p>
        </Card>
        <Card className="p-6 bg-zinc-950 border-[#39FF14]/10">
          <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
          <p className="text-2xl font-bold text-white mt-2">
            {data?.activeUser}
          </p>
        </Card>
        <Card className="p-6 bg-zinc-950 border-[#39FF14]/10">
          <h3 className="text-sm font-medium text-gray-400">Total Beats</h3>
          <p className="text-2xl font-bold text-white mt-2">
            {data?.totalBeats}
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-zinc-950 border-[#39FF14]/10">
        <h3 className="text-lg font-medium text-white mb-4">
          Download Analytics
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.downloads.monthlyDownloadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #39FF14",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="downloads" fill="#39FF14" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
