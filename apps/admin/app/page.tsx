import { AdminProvider } from '@repo/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card'
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Globe,
  MessageSquare 
} from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '2,543', icon: Users, change: '+12%' },
    { title: 'Content Items', value: '1,234', icon: FileText, change: '+8%' },
    { title: 'Active Sessions', value: '156', icon: BarChart3, change: '+23%' },
    { title: 'System Health', value: '99.9%', icon: Shield, change: '0%' },
  ]

  const quickActions = [
    { title: 'User Management', description: 'Manage users, roles, and permissions', icon: Users, href: '/users' },
    { title: 'Content Management', description: 'Create, edit, and publish content', icon: FileText, href: '/content' },
    { title: 'Analytics', description: 'View detailed analytics and reports', icon: BarChart3, href: '/analytics' },
    { title: 'System Settings', description: 'Configure system-wide settings', icon: Settings, href: '/settings' },
    { title: 'Database', description: 'Manage database and migrations', icon: Database, href: '/database' },
    { title: 'Webhooks', description: 'Configure webhooks and integrations', icon: Globe, href: '/webhooks' },
    { title: 'Community', description: 'Manage forums and community features', icon: MessageSquare, href: '/community' },
    { title: 'Security', description: 'Security settings and monitoring', icon: Shield, href: '/security' },
  ]

  return (
    <AdminProvider>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin panel. Monitor and manage your application.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Card key={action.title} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <action.icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminProvider>
  )
}

export default AdminDashboard 