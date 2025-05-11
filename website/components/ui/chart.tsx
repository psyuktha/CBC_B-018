"use client"

import * as React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
  defaults,
} from 'chart.js'
import {
  Line as ReactChartJSLine,
  Pie as ReactChartJSPie,
  Bar as ReactChartJSBar,
} from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend
)

// Configure defaults to match the app's design system
defaults.font.family = "'Inter', sans-serif"
defaults.color = '#6B7280' // text-gray-500
defaults.borderColor = '#E5E7EB' // border-gray-200

// Export re-usable components
export const Line = ReactChartJSLine
export const Pie = ReactChartJSPie
export const Bar = ReactChartJSBar

// Export ChartJS types for convenience
export type { ChartData, ChartOptions }

// Export individual chart components that might be referenced elsewhere
// but aren't actually used with react-chartjs-2
// For compatibility with any code expecting Recharts-style components
export const Area = ReactChartJSLine
export const AreaChart = ReactChartJSLine
export const CartesianGrid: React.FC = () => null
export const Cell: React.FC = () => null
export const Legend: React.FC = () => null
export const LineChart = ReactChartJSLine
export const PieChart = ReactChartJSPie
export const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: '100%', height: '100%' }}>{children}</div>
)
export const Tooltip: React.FC = () => null
export const XAxis: React.FC = () => null
export const YAxis: React.FC = () => null
