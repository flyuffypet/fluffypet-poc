"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart } from "lucide-react"

export function SOSGuidance() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Shield className="h-5 w-5" />
          Safety Guidance While Waiting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <p className="font-medium text-green-700">DO:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Keep a safe distance</li>
                  <li>• Stay calm and quiet</li>
                  <li>• Monitor the animal's condition</li>
                  <li>• Keep your phone nearby</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <p className="font-medium text-red-700">DON'T:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Approach aggressive animals</li>
                  <li>• Give food or water</li>
                  <li>• Move injured animals</li>
                  <li>• Create crowds or noise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Remember</span>
          </div>
          <p className="text-sm text-blue-700">
            Your quick action can save a life. Help is on the way - trained responders will handle the situation safely.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
