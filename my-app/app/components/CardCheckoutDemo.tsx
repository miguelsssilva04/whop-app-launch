'use client';
import { useState } from 'react';
import { Button, Card, Heading, Text, TextField, Select } from '@whop/react/components';
import { useIframeSdk } from '@whop/react';

interface CardCheckoutDemoProps {
  experienceId: string;
  userId?: string;
  onSuccess?: (receiptId: string) => void;
}

export default function CardCheckoutDemo({ experienceId, userId, onSuccess }: CardCheckoutDemoProps) {
  const [price, setPrice] = useState<number>(99);
  const [packageType, setPackageType] = useState<string>('one_time');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const iframeSdk = useIframeSdk();

  async function handlePurchase() {
    setIsLoading(true);
    setPurchaseError(null);
    const checkoutResponse = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-whop-user-id': userId || '',
      },
      body: JSON.stringify({
        price,
        planType: packageType,
        title: 'Test Payment',
        experienceId,
      }),
    });
    if (!checkoutResponse.ok) {
      const err = await checkoutResponse.json().catch(() => ({}));
      setPurchaseError(err?.error || 'Failed to create checkout configuration');
      return;
    }
    const checkoutData = await checkoutResponse.json();

    const paymentResult = await iframeSdk.inAppPurchase({
      planId: checkoutData.plan.id,
      id: checkoutData.id,
    });
    setIsLoading(false);

    if (paymentResult.status === 'ok') {
      const receiptId = (paymentResult.data as any).receiptId || (paymentResult.data as any).receipt_id;
      if (onSuccess && receiptId) onSuccess(receiptId);
    } else {
      setPurchaseError((paymentResult as any).error || 'Payment failed');
    }
  }

  return (
    <Card>
      <div className="p-6 flex flex-col gap-4">
        <Heading as="h2" size="5">Test Checkout</Heading>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Text as="label" size="3">Price (USD)</Text>
            <TextField.Root>
              <TextField.Input
                id="price"
                type="number"
                placeholder="20"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </TextField.Root>
          </div>
          <div className="flex-1 flex flex-col">
            <Text as="label" size="3">Package</Text>
            <Select.Root value={packageType} onValueChange={(value) => setPackageType(value)}>
              <Select.Trigger placeholder="Select a package" />
              <Select.Content>
                {['one_time', 'renewal'].map((tag) => (
                  <Select.Item key={tag} value={tag}>{tag}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="classic" onClick={handlePurchase} loading={isLoading}>
            Test Whop Payment Modal
          </Button>
          {purchaseError && (
            <Text as="p" size="3" color="red">{purchaseError}</Text>
          )}
        </div>
      </div>
    </Card>
  );
}