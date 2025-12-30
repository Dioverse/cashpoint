
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Growth",
      value: "23.5%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Active Transactions",
      value: "1,234",
      change: "+15%",
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New user registration", time: "2 minutes ago" },
                { action: "Payment processed", time: "5 minutes ago" },
                { action: "Data transaction completed", time: "10 minutes ago" },
                { action: "Airtime purchase", time: "15 minutes ago" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-foreground">{activity.action}</span>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors text-left">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <div className="font-medium text-foreground">Add User</div>
                <div className="text-sm text-muted-foreground">Create new account</div>
              </button>
              <button className="p-4 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors text-left">
                <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                <div className="font-medium text-foreground">Process Payment</div>
                <div className="text-sm text-muted-foreground">Handle transaction</div>
              </button>
              <button className="p-4 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors text-left">
                <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                <div className="font-medium text-foreground">View Reports</div>
                <div className="text-sm text-muted-foreground">Analytics dashboard</div>
              </button>
              <button className="p-4 bg-orange-50 dark:bg-orange-950 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-colors text-left">
                <Activity className="w-6 h-6 text-orange-600 mb-2" />
                <div className="font-medium text-foreground">Monitor System</div>
                <div className="text-sm text-muted-foreground">Check status</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
