import { PageHeader } from '@/components/reusable/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences"
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general application settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings content will be added here...
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Notification settings will be added here...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
