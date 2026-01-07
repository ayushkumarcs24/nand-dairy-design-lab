import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { motion } from "framer-motion";

interface Alert {
    type: string;
    severity: "info" | "warning" | "error";
    title: string;
    message: string;
}

export function SamitiAlerts() {
    const { data: alertsData } = useQuery<{ alerts: Alert[] }>({
        queryKey: ["samiti-alerts"],
        queryFn: async () => {
            const res = await api.get<{ alerts: Alert[] }>("/samiti/alerts");
            return res.data;
        },
        refetchInterval: 60000, // Refetch every minute
    });

    const alerts = alertsData?.alerts || [];

    if (alerts.length === 0) {
        return (
            <Card className="border-green-200 bg-green-50/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                        <Bell className="h-5 w-5" />
                        Alerts & Notifications
                    </CardTitle>
                    <CardDescription>All systems running smoothly!</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "error":
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-amber-600" />;
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case "error":
                return "border-red-200 bg-red-50/50";
            case "warning":
                return "border-amber-200 bg-amber-50/50";
            default:
                return "border-blue-200 bg-blue-50/50";
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Alerts & Notifications
                </CardTitle>
                <CardDescription>Recent alerts that require your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                    <motion.div
                        key={`${alert.type}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${getSeverityStyles(alert.severity)}`}
                    >
                        <div className="flex items-start gap-3">
                            {getSeverityIcon(alert.severity)}
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">{alert.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
