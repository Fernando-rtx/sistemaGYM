CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Empleado',
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios can read their own data" ON public.usuarios
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Anyone can read usuarios for auth" ON public.usuarios
    FOR SELECT TO anon
    USING (true);

INSERT INTO public.usuarios (username, password, nombre, role) VALUES
    ('fernando', '123', 'Fernando', 'Creador'),
    ('admin', '123', 'Administrador', 'Admin'),
    ('empleado', '123', 'Recepcionista', 'Empleado')
ON CONFLICT (username) DO NOTHING;
