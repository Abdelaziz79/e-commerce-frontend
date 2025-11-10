// components/products/create/BasicInfoForm.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductData } from "@/types/product";
import { FileText } from "lucide-react";

interface BasicInfoFormProps {
  formData: CreateProductData;
  handleInputChange: (field: keyof CreateProductData, value: string) => void;
}

export function BasicInfoForm({
  formData,
  handleInputChange,
}: BasicInfoFormProps) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <FileText className="h-4 w-4 text-gray-500" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter product name"
            className="h-9 text-sm border-gray-200 rounded-none"
          />
          <p className="text-xs text-gray-500">Keep it clear and searchable</p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-xs font-medium text-gray-700"
          >
            Short Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief summary for product cards"
            rows={3}
            className="resize-none border-gray-200 text-sm rounded-none"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Used in product cards and search results</span>
            <span
              className={
                formData.description.length > 1000 ? "text-amber-600" : ""
              }
            >
              {formData.description.length} / 1000
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="richDescription"
            className="text-xs font-medium text-gray-700"
          >
            Detailed Description
            <span className="text-gray-400 text-xs ml-1.5">(Optional)</span>
          </Label>
          <Textarea
            id="richDescription"
            value={formData.richDescription || ""}
            onChange={(e) =>
              handleInputChange("richDescription", e.target.value)
            }
            placeholder="Comprehensive description with specifications and benefits"
            rows={6}
            className="resize-y min-h-[120px] border-gray-200 text-sm rounded-none"
          />
          <p className="text-xs text-gray-500">
            Appears on full product page. Basic HTML supported.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
