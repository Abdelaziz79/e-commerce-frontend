// components/products/create/BasicInfoForm.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductData } from "@/types/product";
import { FileText, Sparkles } from "lucide-react";

interface BasicInfoFormProps {
  formData: CreateProductData;
  handleInputChange: (field: keyof CreateProductData, value: string) => void;
}

export function BasicInfoForm({
  formData,
  handleInputChange,
}: BasicInfoFormProps) {
  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            Product Information
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            Required
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            Product Name
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter a descriptive product name"
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            Keep it clear and searchable
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            Short Description
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="A brief, compelling summary that highlights key features..."
            rows={3}
            className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
          />
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Used in product cards and search results</span>
            <span
              className={
                formData.description.length > 150 ? "text-amber-600" : ""
              }
            >
              {formData.description.length} / 150
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="richDescription"
            className="text-sm font-medium text-gray-700"
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
            placeholder="Provide a comprehensive description with all the details customers need to know. You can include specifications, use cases, and benefits..."
            rows={6}
            className="resize-y min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            This appears on the full product page. Basic HTML is supported.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
