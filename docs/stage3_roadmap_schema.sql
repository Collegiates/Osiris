-- Stage 3 roadmap graph schema additions

ALTER TABLE public.roadmaps
ADD COLUMN IF NOT EXISTS topic_id uuid;

CREATE TABLE IF NOT EXISTS public.roadmap_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL,
  problem_version_id uuid NOT NULL,
  node_type text NOT NULL CHECK (node_type IN ('core', 'remedial')),
  difficulty text,
  position_index integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT roadmap_nodes_pkey PRIMARY KEY (id),
  CONSTRAINT roadmap_nodes_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id),
  CONSTRAINT roadmap_nodes_problem_version_id_fkey FOREIGN KEY (problem_version_id) REFERENCES public.problem_versions(id)
);

CREATE TABLE IF NOT EXISTS public.roadmap_edges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL,
  from_node_id uuid NOT NULL,
  to_node_id uuid NOT NULL,
  edge_type text NOT NULL CHECK (edge_type IN ('next', 'branch')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT roadmap_edges_pkey PRIMARY KEY (id),
  CONSTRAINT roadmap_edges_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id),
  CONSTRAINT roadmap_edges_from_node_id_fkey FOREIGN KEY (from_node_id) REFERENCES public.roadmap_nodes(id),
  CONSTRAINT roadmap_edges_to_node_id_fkey FOREIGN KEY (to_node_id) REFERENCES public.roadmap_nodes(id)
);

CREATE TABLE IF NOT EXISTS public.roadmap_node_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  roadmap_id uuid NOT NULL,
  node_id uuid NOT NULL,
  state text NOT NULL CHECK (state IN ('locked', 'available', 'in_progress', 'completed', 'skipped', 'stuck')),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT roadmap_node_progress_pkey PRIMARY KEY (id),
  CONSTRAINT roadmap_node_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id),
  CONSTRAINT roadmap_node_progress_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id),
  CONSTRAINT roadmap_node_progress_node_id_fkey FOREIGN KEY (node_id) REFERENCES public.roadmap_nodes(id)
);

CREATE INDEX IF NOT EXISTS roadmap_nodes_roadmap_id_idx ON public.roadmap_nodes(roadmap_id);
CREATE INDEX IF NOT EXISTS roadmap_edges_roadmap_id_idx ON public.roadmap_edges(roadmap_id);
CREATE INDEX IF NOT EXISTS roadmap_node_progress_user_idx ON public.roadmap_node_progress(user_id, roadmap_id);
