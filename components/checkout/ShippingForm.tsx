// components/checkout/ShippingForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingAddress } from "@/types/order";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Shipping Information
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Where should we deliver your order?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Street Address */}
        <div>
          <Label
            htmlFor="address"
            className="block text-sm font-medium text-slate-900 mb-2"
          >
            Street Address
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street, Apt 4B"
            className={cn(
              "h-12 rounded-xl transition-all",
              errors.address
                ? "border-red-300 focus-visible:ring-red-500"
                : "border-slate-200"
            )}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1.5">{errors.address}</p>
          )}
        </div>

        {/* City & Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="city"
              className="block text-sm font-medium text-slate-900 mb-2"
            >
              City
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              className={cn(
                "h-12 rounded-xl transition-all",
                errors.city
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "border-slate-200"
              )}
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="postalCode"
              className="block text-sm font-medium text-slate-900 mb-2"
            >
              Postal Code
            </Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="10001"
              className={cn(
                "h-12 rounded-xl transition-all",
                errors.postalCode
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "border-slate-200"
              )}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500 mt-1.5">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <Label
            htmlFor="country"
            className="block text-sm font-medium text-slate-900 mb-2"
          >
            Country
          </Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="United States"
            className={cn(
              "h-12 rounded-xl transition-all",
              errors.country
                ? "border-red-300 focus-visible:ring-red-500"
                : "border-slate-200"
            )}
          />
          {errors.country && (
            <p className="text-xs text-red-500 mt-1.5">{errors.country}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-slate-900 mb-2"
          >
            Phone Number{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="h-12 border-slate-200 rounded-xl"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1.5">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm hover:shadow-md transition-all"
          size="lg"
        >
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
