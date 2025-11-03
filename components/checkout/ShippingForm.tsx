// components/checkout/ShippingForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingAddress } from "@/types/order";
import { MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData: ShippingAddress | null;
}

export function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>(
    initialData || {
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
    }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.address.trim() || formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }
    if (!formData.city.trim() || formData.city.length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }
    if (!formData.postalCode.trim() || formData.postalCode.length < 3) {
      newErrors.postalCode = "Postal code must be at least 3 characters";
    }
    if (!formData.country.trim() || formData.country.length < 2) {
      newErrors.country = "Country must be at least 2 characters";
    }
    if (
      formData.phoneNumber &&
      !/^\+?[\d\s-()]{10,20}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Shipping Information</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Where should we deliver your order?
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="address" className="text-base font-semibold">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, Apt 4B"
              className={`mt-2 ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                <span className="text-xs">⚠</span> {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="city" className="text-base font-semibold">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className={`mt-2 ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-xs">⚠</span> {errors.city}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode" className="text-base font-semibold">
                Postal Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="10001"
                className={`mt-2 ${errors.postalCode ? "border-red-500" : ""}`}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-xs">⚠</span> {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="country" className="text-base font-semibold">
              Country <span className="text-red-500">*</span>
            </Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
              className={`mt-2 ${errors.country ? "border-red-500" : ""}`}
            />
            {errors.country && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                <span className="text-xs">⚠</span> {errors.country}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-base font-semibold">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className={`mt-2 ${errors.phoneNumber ? "border-red-500" : ""}`}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                <span className="text-xs">⚠</span> {errors.phoneNumber}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continue to Payment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
