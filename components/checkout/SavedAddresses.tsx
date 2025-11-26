// components/checkout/SavedAddresses.tsx
import { Button } from "@/components/ui/button";
import { Address } from "@/types/user";
import { MapPin, Check, Plus, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedAddressesProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (address: Address) => void;
  onUseNewAddress: () => void;
}

export function SavedAddresses({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onUseNewAddress,
}: SavedAddressesProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Shipping Address</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose from your saved addresses or add a new one
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {addresses.map((address) => (
          <button
            key={address._id}
            onClick={() => onSelectAddress(address)}
            className={cn(
              "w-full text-left p-5 border-2 rounded-xl transition-all relative",
              selectedAddressId === address._id
                ? "border-slate-900 bg-slate-50 shadow-sm"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  selectedAddressId === address._id
                    ? "border-slate-900 bg-slate-900"
                    : "border-slate-300"
                )}
              >
                {selectedAddressId === address._id && (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin
                    className={cn(
                      "h-4 w-4",
                      selectedAddressId === address._id
                        ? "text-slate-900"
                        : "text-slate-400"
                    )}
                  />
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-xs font-medium text-blue-700">
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">
                    {address.address}
                  </p>
                  <p className="text-slate-600">
                    {address.city}, {address.postalCode}
                  </p>
                  <p className="text-slate-600">{address.country}</p>
                  {address.phoneNumber && (
                    <div className="flex items-center gap-1 text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <Phone className="h-3 w-3" />
                      <span className="text-xs">{address.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onUseNewAddress}
        className="w-full h-12 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Address
      </Button>
    </div>
  );
}
