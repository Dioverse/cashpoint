import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DollarSign,
  Check,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const Pricing = () => {
  const categories = [
    {
      id: 1,
      name: 'Data',
      plans: [
        {
          id: 1,
          name: 'Basic Data',
          price: '$5.99',
          period: 'month',
          status: 'Active',
        },
        {
          id: 2,
          name: 'Premium Data',
          price: '$14.99',
          period: 'month',
          status: 'Active',
        },
      ],
    },
    {
      id: 2,
      name: 'Airtime',
      plans: [
        {
          id: 1,
          name: 'Standard Airtime',
          price: '$10.00',
          period: 'month',
          status: 'Active',
        },
        {
          id: 2,
          name: 'Premium Airtime',
          price: '$25.00',
          period: 'month',
          status: 'Active',
        },
      ],
    },
    {
      id: 3,
      name: 'Bill',
      plans: [
        {
          id: 1,
          name: 'Basic Bill',
          price: '$0.99',
          period: 'transaction',
          status: 'Active',
        },
        {
          id: 2,
          name: 'Premium Bill',
          price: '$1.99',
          period: 'transaction',
          status: 'Active',
        },
      ],
    },
    {
      id: 4,
      name: 'Cable',
      plans: [
        {
          id: 1,
          name: 'Basic Cable',
          price: '$19.99',
          period: 'month',
          status: 'Active',
        },
        {
          id: 2,
          name: 'Premium Cable',
          price: '$39.99',
          period: 'month',
          status: 'Active',
        },
      ],
    },
    {
      id: 5,
      name: 'Giftcard',
      plans: [
        {
          id: 1,
          name: 'Standard Giftcard',
          price: '$0.99',
          period: 'transaction',
          status: 'Active',
        },
        {
          id: 2,
          name: 'Premium Giftcard',
          price: '$1.99',
          period: 'transaction',
          status: 'Active',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pricing Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage pricing plans for all services
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              All Plans
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search plans..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.id} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {category.name} Plans
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Plan Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Period
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.plans.map((plan) => (
                        <tr
                          key={plan.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4 text-foreground font-medium">
                            {plan.name}
                          </td>
                          <td className="py-3 px-4 text-foreground">
                            {plan.price}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {plan.period}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                plan.status === 'Active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              {plan.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Edit Plan"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Delete Plan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Toggle Status"
                              >
                                {plan.status === 'Active' ? (
                                  <ToggleRight className="w-4 h-4" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pricing;
