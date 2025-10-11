import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface EMICalculatorProps {
  carPrice: number;
}

export const EMICalculator = ({ carPrice }: EMICalculatorProps) => {
  const [downPayment, setDownPayment] = useState(carPrice * 0.2); // 20% default
  const [loanTenure, setLoanTenure] = useState(5); // 5 years default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default

  const principal = carPrice - downPayment;
  const monthlyRate = interestRate / 12 / 100;
  const months = loanTenure * 12;
  
  // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const emi = principal > 0 
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1)
    : 0;

  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
        <CardDescription>Calculate your monthly loan payment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Car Price: {formatCurrency(carPrice)}</Label>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Down Payment</Label>
            <span className="text-sm font-medium">{formatCurrency(downPayment)}</span>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            min={0}
            max={carPrice * 0.9}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>{Math.round((downPayment / carPrice) * 100)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Loan Tenure (Years)</Label>
            <span className="text-sm font-medium">{loanTenure} years</span>
          </div>
          <Slider
            value={[loanTenure]}
            onValueChange={(value) => setLoanTenure(value[0])}
            min={1}
            max={7}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Interest Rate (%)</Label>
            <span className="text-sm font-medium">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={5}
            max={15}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Loan Amount</span>
            <span className="font-medium">{formatCurrency(principal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Interest</span>
            <span className="font-medium">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-medium">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-lg font-semibold">Monthly EMI</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(emi)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
