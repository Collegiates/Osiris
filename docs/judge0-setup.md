# Judge0 Setup Guide (Ubuntu 22.04)

## 1. Start with Ubuntu 22.04

Use Ubuntu 22.04 (Jammy) — either a bare metal install or a VM. Other versions may have compatibility issues with Judge0's dependencies.

---

## 2. Install Docker

Remove any old Docker packages:
```bash
sudo apt remove -y docker docker-engine docker.io containerd runc
```

Add Docker's official repo and install:
```bash
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Start Docker and add your user to the docker group:
```bash
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

Verify:
```bash
docker --version
docker compose version
```

---

## 3. Fix Cgroups (Critical for VMs)

Ubuntu 22.04 defaults to cgroup v2, but Judge0's isolate sandbox requires cgroup v1. Fix this before setting up Judge0.

Open the grub config:
```bash
sudo nano /etc/default/grub
```

Find `GRUB_CMDLINE_LINUX_DEFAULT` and update it to:
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash systemd.unified_cgroup_hierarchy=0"
```

Apply and reboot:
```bash
sudo update-grub && sudo reboot
```

After reboot, verify cgroup v1 is active:
```bash
grep cgroup /proc/mounts | head -5
```

You should see lines referencing `cgroup` (v1) — not just `cgroup2`.

---

## 4. Clone Judge0

Install required tools and clone the repo:
```bash
sudo apt install -y git curl jq
git clone https://github.com/judge0/judge0.git
cd judge0
```

---

## 5. Configure judge0.conf

Copy the example config:
```bash
cp judge0.conf.example judge0.conf
```

Open it and set at minimum:
```bash
nano judge0.conf
```

Key values to set:
```
POSTGRES_PASSWORD=your_postgres_password
REDIS_PASSWORD=your_redis_password
SECRET_KEY_BASE=your_long_random_secret
```

You can generate a secret key with:
```bash
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 128
```

---

## 6. Start Judge0

```bash
docker compose up -d
```

Wait about 30–60 seconds for all services to start, then check they're running:
```bash
docker compose ps
```

---

## 7. Test It

Check available languages:
```bash
curl -s http://localhost:2358/languages | jq '.[0:3]'
```

Submit a test Python job:
```bash
curl -s -X POST 'http://localhost:2358/submissions/?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"source_code":"print(2+3)","language_id":71}' | jq
```

Expected response:
```json
{
  "stdout": "5\n",
  "status": {
    "id": 3,
    "description": "Accepted"
  }
}
```

---

## 8. Auto-Start on Boot

Add a restart policy to your `docker-compose.yml` so containers start automatically when the VM boots:

```bash
nano ~/judge0/docker-compose.yml
```

Add `restart: unless-stopped` to each service block:
```yaml
services:
  server:
    restart: unless-stopped
    ...
  worker:
    restart: unless-stopped
    ...
  db:
    restart: unless-stopped
    ...
  redis:
    restart: unless-stopped
    ...
```

Recreate the containers to apply the change:
```bash
cd ~/judge0
docker compose down && docker compose up -d
```

Verify the restart policy was applied:
```bash
docker inspect judge0-server-1 | grep RestartPolicy -A3
```

`unless-stopped` means:
- Auto-starts on VM boot
- Auto-restarts if a container crashes
- Stays stopped if you manually run `docker compose down`

> Docker itself is already enabled on boot from step 2, so this is all that's needed.

---

## Troubleshooting

**`Internal Error` / `No such file or directory @ rb_sysopen - /box/script.py`**
- Cgroup v1 is not enabled. Go back to step 3.

**`docker-compose-plugin` not found**
- You're using Ubuntu's default repos. Follow step 2 to add Docker's official repo.

**Worker starts but submissions hang**
- Check worker logs: `docker compose logs worker --tail=50`
- Make sure `--privileged` is set in your `docker-compose.yml` for the worker service.
