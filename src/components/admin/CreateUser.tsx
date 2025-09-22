"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_URL } from "@/constants/data";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  username: string;
  role: string;
  credit: number;
}

interface ToastMessage {
  id: number;
  text: string;
}

const roleColors: Record<string, string> = {
  user: "bg-blue-500 text-white",
  admin: "bg-red-500 text-white",
};

const CreateUser: React.FC = () => {
  const t = useTranslations("Admin.CreateUser");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [credit, setCredit] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = React.useCallback((text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users/all`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      showToast(t("errors.fetchUsers"));
    }
  }, [showToast, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async () => {
    if (!username || !password) {
      showToast(t("errors.emptyFields"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, credit }),
      });
      const data = await res.json();
      if (data.user) {
        showToast(t("messages.userCreated", { username: data.user.username }));
        setUsername("");
        setPassword("");
        setRole("user");
        setCredit(0);
        fetchUsers();
      } else {
        showToast(t("errors.createUser"));
      }
    } catch (err) {
      console.error(err);
      showToast(t("errors.createUser"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    const confirmed = window.confirm(t("confirmDelete", { username }));
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/users/public/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(t("messages.userDeleted", { username }));
        fetchUsers();
      } else {
        showToast(t("errors.deleteUser"));
      }
    } catch (err) {
      console.error(err);
      showToast(t("errors.deleteUser"));
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Форма */}
      <div className="flex flex-col gap-4 md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">{t("form.title")}</h2>

        <div className="flex flex-col gap-2">
          <Label>{t("form.username")}</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>{t("form.password")}</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-4 items-end">
          <div className="flex flex-col gap-2 flex-1">
            <Label>{t("form.role")}</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "user" | "admin")}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("form.rolePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t("roles.user")}</SelectItem>
                <SelectItem value="admin">{t("roles.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-1/3">
            <Label>{t("form.credit")}</Label>
            <Input
              type="number"
              value={credit}
              min={0}
              onChange={(e) => setCredit(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleCreate} disabled={loading}>
          {loading ? t("form.creating") : t("form.create")}
        </Button>
      </div>

      {/* Таблица пользователей */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">{t("table.title")}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.id")}</TableHead>
              <TableHead>{t("table.username")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("table.credit")}</TableHead>
              <TableHead>{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      roleColors[user.role]
                    }`}
                  >
                    {t(`roles.${user.role}`)}
                  </span>
                </TableCell>
                <TableCell>{user.credit}</TableCell>
                <TableCell>
                  {user.role === "user" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id, user.username)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Toast уведомления */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-black text-white px-4 py-2 rounded shadow"
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateUser;
