
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network as NetworkIcon, 
  Activity, 
  TrendingUp, 
  CreditCard,
  Bitcoin,
  Smartphone,
  Zap,
  Tv
} from "lucide-react";

const Network = () => {
  const networkCategories = [
    // Gift Cards
    { name: "GIFTCARD", type: "Gift Card", status: "Online", uptime: "99.9%", transactions: "8,234", icon: CreditCard, color: "bg-purple-100 dark:bg-purple-900 text-purple-600" },
    
    // Crypto
    { name: "CRYPTO", type: "Cryptocurrency", status: "Online", uptime: "99.8%", transactions: "5,142", icon: Bitcoin, color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600" },
    
    // Mobile Networks
    { name: "MTN", type: "Mobile Network", status: "Online", uptime: "99.9%", transactions: "15,234", icon: Smartphone, color: "bg-blue-100 dark:bg-blue-900 text-blue-600" },
    { name: "GLO", type: "Mobile Network", status: "Online", uptime: "99.7%", transactions: "12,891", icon: Smartphone, color: "bg-green-100 dark:bg-green-900 text-green-600" },
    { name: "AIRTEL", type: "Mobile Network", status: "Maintenance", uptime: "97.5%", transactions: "8,543", icon: Smartphone, color: "bg-red-100 dark:bg-red-900 text-red-600" },
    { name: "9MOBILE", type: "Mobile Network", status: "Online", uptime: "99.2%", transactions: "6,722", icon: Smartphone, color: "bg-orange-100 dark:bg-orange-900 text-orange-600" },
    
    // Billers
    { name: "IBEDC", type: "Electricity", status: "Online", uptime: "98.9%", transactions: "4,231", icon: Zap, color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600" },
    { name: "EKEDC", type: "Electricity", status: "Online", uptime: "98.7%", transactions: "3,892", icon: Zap, color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600" },
    { name: "AEDC", type: "Electricity", status: "Online", uptime: "99.1%", transactions: "3,567", icon: Zap, color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600" },
    { name: "IKEDC", type: "Electricity", status: "Maintenance", uptime: "96.8%", transactions: "2,934", icon: Zap, color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600" },
    { name: "PHEDC", type: "Electricity", status: "Online", uptime: "98.4%", transactions: "2,671", icon: Zap, color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600" },
    
    // TV Services
    { name: "GOTV", type: "Television", status: "Online", uptime: "99.3%", transactions: "5,892", icon: Tv, color: "bg-teal-100 dark:bg-teal-900 text-teal-600" },
    { name: "DSTV", type: "Television", status: "Online", uptime: "99.6%", transactions: "7,234", icon: Tv, color: "bg-teal-100 dark:bg-teal-900 text-teal-600" },
    { name: "STARTIMES", type: "Television", status: "Online", uptime: "98.9%", transactions: "3,456", icon: Tv, color: "bg-teal-100 dark:bg-teal-900 text-teal-600" },
  ];

  const totalCategories = networkCategories.length;
  const onlineCategories = networkCategories.filter(cat => cat.status === 'Online').length;
  const totalTransactions = networkCategories.reduce((sum, cat) => sum + parseInt(cat.transactions.replace(',', '')), 0);
  const avgUptime = (networkCategories.reduce((sum, cat) => sum + parseFloat(cat.uptime), 0) / totalCategories).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Network Categories</h1>
        <p className="text-muted-foreground mt-2">Monitor all network categories and their performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <NetworkIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-2xl font-bold text-foreground">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-foreground">{onlineCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Uptime</p>
                <p className="text-2xl font-bold text-foreground">{avgUptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <NetworkIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground">{totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Uptime</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Transactions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Performance</th>
                </tr>
              </thead>
              <tbody>
                {networkCategories.map((category, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                          <category.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground">{category.type}</td>
                    <td className="py-4 px-4">
                      <Badge variant={category.status === 'Online' ? 'default' : 'secondary'}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          category.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        {category.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-foreground">{category.uptime}</td>
                    <td className="py-4 px-4 text-foreground">{category.transactions}</td>
                    <td className="py-4 px-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: category.uptime }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Network;
