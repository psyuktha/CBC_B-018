"use client"

import React from 'react'
import { Line, Pie, Bar } from '@/components/ui/chart'
import type { ChartData, ChartOptions } from 'chart.js'

export default function ChartTestPage() {
  // Sample data for a line chart
  const lineData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sample Data',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  }

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Line Chart',
      },
    },
  }

  // Sample data for a pie chart
  const pieData: ChartData<'pie'> = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pie Chart',
      },
    },
  }

  // Sample data for a bar chart
  const barData: ChartData<'bar'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ],
  }

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bar Chart',
      },
    },
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chart Testing Page</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Line Chart</h2>
          <div className="h-[400px] w-full">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Pie Chart</h2>
          <div className="h-[400px] w-full">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>
          <div className="h-[400px] w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
