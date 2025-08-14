"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSettings } from "@/contexts/settings-context"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { settings, updateSettings, updateAvatar, updateNotifications, updatePrivacy } = useSettings()
  const { t, locale, setLocale } = useTranslation()
  const { toast } = useToast()

  // Initialize state only after settings are loaded
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(settings?.avatar)

  // Guard clause for when settings are still loading
  if (!settings) {
    return (
      <div className="container mx-auto py-10">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar)
    updateAvatar(avatar)
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      timezone: formData.get("timezone") as string,
    }

    await updateSettings(data)
    toast({
      title: t("settings.toasts.accountSaved"),
    })
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle security form submission
    toast({
      title: t("settings.toasts.securitySaved"),
    })
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      language: formData.get("language") as string,
      currency: formData.get("currency") as string,
      dateFormat: formData.get("dateFormat") as string,
      theme: formData.get("theme") as "light" | "dark" | "system",
    }

    await updateSettings(data)
    setLocale(data.language as any)
    toast({
      title: t("settings.toasts.preferencesSaved"),
    })
  }

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      email: formData.get("emailNotifications") === "on",
      push: formData.get("pushNotifications") === "on",
      sms: formData.get("smsNotifications") === "on",
      marketing: formData.get("marketingNotifications") === "on",
      updates: formData.get("updateNotifications") === "on",
      accountActivity: formData.get("accountActivityNotifications") === "on",
    }

    await updateNotifications(data)
    toast({
      title: t("settings.toasts.notificationsSaved"),
    })
  }

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      dataSharing: formData.get("dataSharing") === "on",
      accountVisibility: formData.get("accountVisibility") as "public" | "private",
      personalizedAds: formData.get("personalizedAds") === "on",
    }

    await updatePrivacy(data)
    toast({
      title: t("settings.toasts.privacySaved"),
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4">
          <TabsTrigger value="account">{t("settings.tabs.account")}</TabsTrigger>
          <TabsTrigger value="security">{t("settings.tabs.security")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("settings.tabs.preferences")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="privacy">{t("settings.tabs.privacy")}</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.account.title")}</CardTitle>
              <CardDescription>{t("settings.account.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("settings.account.currentAvatar")}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div
                        className={`border-2 rounded-full p-1 ${selectedAvatar === settings.avatar ? "border-primary" : "border-transparent"}`}
                      >
                        <img
                          src={settings.avatar || "/placeholder.svg"}
                          alt="Current avatar"
                          className="w-16 h-16 rounded-full"
                          onClick={() => handleAvatarChange(settings.avatar)}
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{t("settings.account.chooseAvatar")}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`border-2 rounded-full p-1 cursor-pointer ${
                            selectedAvatar === `/placeholder.svg?height=100&width=100&query=avatar${i}`
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => handleAvatarChange(`/placeholder.svg?height=100&width=100&query=avatar${i}`)}
                        >
                          <img
                            src={`/placeholder.svg?height=100&width=100&query=avatar${i}`}
                            alt={`Avatar option ${i}`}
                            className="w-16 h-16 rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t("settings.account.uploadCustom")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t("settings.account.fullName")}</Label>
                      <Input id="fullName" name="fullName" defaultValue={settings.fullName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("settings.account.email")}</Label>
                      <Input id="email" name="email" type="email" defaultValue={settings.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("settings.account.phone")}</Label>
                      <Input id="phone" name="phone" defaultValue={settings.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">{t("settings.account.timezone")}</Label>
                      <Select name="timezone" defaultValue={settings.timezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-12">{t("timezones.utc-12")}</SelectItem>
                          <SelectItem value="utc-11">{t("timezones.utc-11")}</SelectItem>
                          <SelectItem value="utc-10">{t("timezones.utc-10")}</SelectItem>
                          <SelectItem value="utc-9">{t("timezones.utc-9")}</SelectItem>
                          <SelectItem value="utc-8">{t("timezones.utc-8")}</SelectItem>
                          <SelectItem value="utc-7">{t("timezones.utc-7")}</SelectItem>
                          <SelectItem value="utc-6">{t("timezones.utc-6")}</SelectItem>
                          <SelectItem value="utc-5">{t("timezones.utc-5")}</SelectItem>
                          <SelectItem value="utc-4">{t("timezones.utc-4")}</SelectItem>
                          <SelectItem value="utc-3">{t("timezones.utc-3")}</SelectItem>
                          <SelectItem value="utc-2">{t("timezones.utc-2")}</SelectItem>
                          <SelectItem value="utc-1">{t("timezones.utc-1")}</SelectItem>
                          <SelectItem value="utc+0">{t("timezones.utc+0")}</SelectItem>
                          <SelectItem value="utc+1">{t("timezones.utc+1")}</SelectItem>
                          <SelectItem value="utc+2">{t("timezones.utc+2")}</SelectItem>
                          <SelectItem value="utc+3">{t("timezones.utc+3")}</SelectItem>
                          <SelectItem value="utc+4">{t("timezones.utc+4")}</SelectItem>
                          <SelectItem value="utc+5">{t("timezones.utc+5")}</SelectItem>
                          <SelectItem value="utc+5.5">{t("timezones.utc+5.5")}</SelectItem>
                          <SelectItem value="utc+6">{t("timezones.utc+6")}</SelectItem>
                          <SelectItem value="utc+7">{t("timezones.utc+7")}</SelectItem>
                          <SelectItem value="utc+8">{t("timezones.utc+8")}</SelectItem>
                          <SelectItem value="utc+9">{t("timezones.utc+9")}</SelectItem>
                          <SelectItem value="utc+10">{t("timezones.utc+10")}</SelectItem>
                          <SelectItem value="utc+11">{t("timezones.utc+11")}</SelectItem>
                          <SelectItem value="utc+12">{t("timezones.utc+12")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button type="submit">{t("settings.account.saveButton")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.security.title")}</CardTitle>
              <CardDescription>{t("settings.security.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t("settings.security.currentPassword")}</Label>
                      <Input id="currentPassword" name="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("settings.security.newPassword")}</Label>
                      <Input id="newPassword" name="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("settings.security.confirmPassword")}</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactor" name="twoFactor" />
                    <Label htmlFor="twoFactor">{t("settings.security.twoFactor")}</Label>
                  </div>
                </div>

                <Button type="submit">{t("settings.security.saveButton")}</Button>
              </form>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("settings.security.loginHistory.title")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("settings.security.loginHistory.description")}
                  </p>
                  <div className="border rounded-md">
                    <div className="p-4 border-b">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Chrome on Windows</div>
                          <div className="text-sm text-muted-foreground">192.168.1.1</div>
                        </div>
                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="p-4 border-b">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Safari on macOS</div>
                          <div className="text-sm text-muted-foreground">192.168.1.2</div>
                        </div>
                        <div className="text-sm text-muted-foreground">Yesterday</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Firefox on Ubuntu</div>
                          <div className="text-sm text-muted-foreground">192.168.1.3</div>
                        </div>
                        <div className="text-sm text-muted-foreground">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{t("settings.security.activeSessions.title")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("settings.security.activeSessions.description")}
                  </p>
                  <div className="border rounded-md">
                    <div className="p-4 border-b">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Chrome on Windows</div>
                          <div className="text-sm text-muted-foreground">Current session</div>
                        </div>
                        <div className="text-sm text-green-600">Active now</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Safari on iPhone</div>
                          <div className="text-sm text-muted-foreground">Last active 3 hours ago</div>
                        </div>
                        <Button variant="outline" size="sm">
                          {t("settings.security.activeSessions.logoutAll")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.preferences.title")}</CardTitle>
              <CardDescription>{t("settings.preferences.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">{t("settings.preferences.language")}</Label>
                      <Select name="language" defaultValue={settings.language}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{t("languages.en")}</SelectItem>
                          <SelectItem value="es">{t("languages.es")}</SelectItem>
                          <SelectItem value="fr">{t("languages.fr")}</SelectItem>
                          <SelectItem value="de">{t("languages.de")}</SelectItem>
                          <SelectItem value="zh">{t("languages.zh")}</SelectItem>
                          <SelectItem value="pt">{t("languages.pt")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">{t("settings.preferences.currency")}</Label>
                      <Select name="currency" defaultValue={settings.currency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">{t("currencies.usd")}</SelectItem>
                          <SelectItem value="eur">{t("currencies.eur")}</SelectItem>
                          <SelectItem value="gbp">{t("currencies.gbp")}</SelectItem>
                          <SelectItem value="jpy">{t("currencies.jpy")}</SelectItem>
                          <SelectItem value="brl">{t("currencies.brl")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">{t("settings.preferences.dateFormat")}</Label>
                      <Select name="dateFormat" defaultValue={settings.dateFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">{t("dateFormats.mm-dd-yyyy")}</SelectItem>
                          <SelectItem value="dd-mm-yyyy">{t("dateFormats.dd-mm-yyyy")}</SelectItem>
                          <SelectItem value="yyyy-mm-dd">{t("dateFormats.yyyy-mm-dd")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">{t("settings.preferences.theme")}</Label>
                      <Select name="theme" defaultValue={settings.theme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t("settings.preferences.themeOptions.light")}</SelectItem>
                          <SelectItem value="dark">{t("settings.preferences.themeOptions.dark")}</SelectItem>
                          <SelectItem value="system">{t("settings.preferences.themeOptions.system")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button type="submit">{t("settings.preferences.saveButton")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>{t("settings.notifications.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.notifications.channels")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailNotifications">{t("settings.notifications.emailNotifications")}</Label>
                        </div>
                        <Switch
                          id="emailNotifications"
                          name="emailNotifications"
                          defaultChecked={settings.notifications.email}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="pushNotifications">{t("settings.notifications.pushNotifications")}</Label>
                        </div>
                        <Switch
                          id="pushNotifications"
                          name="pushNotifications"
                          defaultChecked={settings.notifications.push}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="smsNotifications">{t("settings.notifications.smsNotifications")}</Label>
                        </div>
                        <Switch
                          id="smsNotifications"
                          name="smsNotifications"
                          defaultChecked={settings.notifications.sms}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.notifications.types")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="accountActivityNotifications">
                            {t("settings.notifications.accountActivity")}
                          </Label>
                        </div>
                        <Switch
                          id="accountActivityNotifications"
                          name="accountActivityNotifications"
                          defaultChecked={settings.notifications.accountActivity}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="updateNotifications">{t("settings.notifications.newFeatures")}</Label>
                        </div>
                        <Switch
                          id="updateNotifications"
                          name="updateNotifications"
                          defaultChecked={settings.notifications.updates}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketingNotifications">{t("settings.notifications.marketing")}</Label>
                        </div>
                        <Switch
                          id="marketingNotifications"
                          name="marketingNotifications"
                          defaultChecked={settings.notifications.marketing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit">{t("settings.notifications.saveButton")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.privacy.title")}</CardTitle>
              <CardDescription>{t("settings.privacy.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePrivacySubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.privacy.dataSharing.title")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dataSharing">{t("settings.privacy.dataSharing.analyticsSharing")}</Label>
                        </div>
                        <Switch id="dataSharing" name="dataSharing" defaultChecked={settings.privacy.dataSharing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="personalizedAds">{t("settings.privacy.dataSharing.personalizedAds")}</Label>
                        </div>
                        <Switch
                          id="personalizedAds"
                          name="personalizedAds"
                          defaultChecked={settings.privacy.personalizedAds}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.privacy.accountVisibility.title")}</h3>
                    <RadioGroup defaultValue={settings.privacy.accountVisibility} name="accountVisibility">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">{t("settings.privacy.accountVisibility.public")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">{t("settings.privacy.accountVisibility.private")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="pt-4 space-y-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("settings.privacy.downloadData")}
                    </Button>
                    <Button variant="destructive" className="w-full">
                      {t("settings.privacy.deleteAccount")}
                    </Button>
                  </div>
                </div>

                <Button type="submit">{t("settings.privacy.saveButton")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
