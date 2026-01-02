made by Sitthipong Chamratritthirong

# How to Run This Project

clone project to your local

```bash
git clone https://github.com/ssszZ-TH/crud_task_profile.git
```

run project

```bash
cd crud_task_profile
docker compose up -d --build
```

if database or backend have error try this step

```bash
delete folder db-data <- this is docker volume from postgres
```

start compose again

```bash
docker compose up -d --build
```

initialize database

```bash
docker compose exec db psql -U spa -d myapp
input this create table command

DROP TABLE IF EXISTS task_profile_log;
DROP TABLE IF EXISTS task_profile;

CREATE TABLE task_profile (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,        -- หัวข้อ/ชื่อเรื่องของงาน
    detail TEXT,                        -- รายละเอียดสิ่งที่ต้องทำ
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    phone_num VARCHAR(20),
    email VARCHAR(255),
    birth_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'done')),
    create_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok'),
    update_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok')
);

CREATE TABLE task_profile_log (
    id SERIAL PRIMARY KEY,
    task_profile_id INTEGER,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    phone_num VARCHAR(20),
    email VARCHAR(255),
    birth_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'done')),
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    action_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok')
);
```

the database is ready to use

# tech stack

- database: postgres
- backend: fastapi
- frontend: react TS

# What is the problem

hr ต้องติดต่อกับ employee ที่มาสมัครงานหลายคนเยอะมากจนจำไม่ได้ว่าจะต้องติดต่อใครบ้าง ติดต่อช่องทางใหน จึงจัดทำ app นี้ขึ้นมาเพื่อความสดวกของ HR ในการติดต่อกับ employee

app นี้มีข้อดีคือ localize ข้อมูลรวมในจุดเดียว ข้อมูลของ  HR ทุกคน sync กันหมด มีการติดตามสถานะว่ารายการที่จะต้องติดต่อกับ employee เสร็จหรือยัง

# image

![img](./image_for_markdown/Screenshot%202026-01-02%20114059.png)

![img](./image_for_markdown/Screenshot%202026-01-02%20114112.png)

![img](./image_for_markdown/Screenshot%202026-01-02%20114124.png)

![img](./image_for_markdown/Screenshot%202026-01-02%20114141.png)

![img](./image_for_markdown/Screenshot%202026-01-02%20114201.png)

![img](./image_for_markdown/Screenshot%202026-01-02%20114210.png)
