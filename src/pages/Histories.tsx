
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { History, Search, Receipt } from "lucide-react";

const Histories = () => {
  const transactionData = {
    giftcard: [
      { id: "GFT001", username: "john_doe", network: "Amazon", reference: "AMZ123456", category: "E-commerce", size: "$50", price: "$47.50", balanceBefore: "$1,250.00", balanceAfter: "$1,202.50" },
      { id: "GFT002", username: "jane_smith", network: "iTunes", reference: "ITU789012", category: "Entertainment", size: "$25", price: "$23.75", balanceBefore: "$850.50", balanceAfter: "$826.75" },
      { id: "GFT003", username: "mike_johnson", network: "Google Play", reference: "GP345678", category: "Apps", size: "$10", price: "$9.50", balanceBefore: "$500.00", balanceAfter: "$490.50" },
    ],
    data: [
      { id: "DAT001", username: "bob_wilson", network: "MTN", reference: "MTN001234", category: "Data Bundle", size: "1GB", price: "$15.00", balanceBefore: "$200.00", balanceAfter: "$185.00" },
      { id: "DAT002", username: "carol_davis", network: "Airtel", reference: "ART567890", category: "Data Bundle", size: "3GB", price: "$30.00", balanceBefore: "$300.00", balanceAfter: "$270.00" },
      { id: "DAT003", username: "david_lee", network: "Glo", reference: "GLO234567", category: "Data Bundle", size: "500MB", price: "$5.00", balanceBefore: "$100.00", balanceAfter: "$95.00" },
    ],
    airtime: [
      { id: "ATM001", username: "emma_watson", network: "MTN", reference: "MTN987654", category: "Airtime", size: "$25", price: "$25.00", balanceBefore: "$500.00", balanceAfter: "$475.00" },
      { id: "ATM002", username: "james_bond", network: "Airtel", reference: "ART123789", category: "Airtime", size: "$50", price: "$50.00", balanceBefore: "$750.00", balanceAfter: "$700.00" },
      { id: "ATM003", username: "maria_garcia", network: "Glo", reference: "GLO456123", category: "Airtime", size: "$10", price: "$10.00", balanceBefore: "$200.00", balanceAfter: "$190.00" },
    ],
  };

  const renderTransactionTable = (transactions: any[], type: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground capitalize">{type} Transactions</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder={`Search ${type}...`} className="pl-10" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Username</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Network</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reference</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Size</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Balance Bfo</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Balance Aft</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4 text-foreground">{transaction.username}</td>
                <td className="py-3 px-4 text-foreground">{transaction.network}</td>
                <td className="py-3 px-4 text-foreground font-mono text-sm">{transaction.reference}</td>
                <td className="py-3 px-4 text-muted-foreground">{transaction.category}</td>
                <td className="py-3 px-4 text-foreground">{transaction.size}</td>
                <td className="py-3 px-4 text-foreground font-medium">{transaction.price}</td>
                <td className="py-3 px-4 text-muted-foreground">{transaction.balanceBefore}</td>
                <td className="py-3 px-4 text-muted-foreground">{transaction.balanceAfter}</td>
                <td className="py-3 px-4">
                  <Button variant="ghost" size="sm" title="View Receipt">
                    <Receipt className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction Histories</h1>
        <p className="text-muted-foreground mt-2">View and manage all transaction records across different services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="giftcard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="giftcard">Giftcard</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="airtime">Airtime</TabsTrigger>
            </TabsList>
            
            <TabsContent value="giftcard" className="mt-6">
              {renderTransactionTable(transactionData.giftcard, 'giftcard')}
            </TabsContent>
            
            <TabsContent value="data" className="mt-6">
              {renderTransactionTable(transactionData.data, 'data')}
            </TabsContent>
            
            <TabsContent value="airtime" className="mt-6">
              {renderTransactionTable(transactionData.airtime, 'airtime')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Histories;
