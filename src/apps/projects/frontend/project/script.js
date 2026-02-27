import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://piuymzvnztipaxskcjuz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_rYpXz1mHoTsZ7kB0UuJ21g_XYy3wo3F";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const userUUID = (await sb.auth.getUser()).data.user.id;

const projectUUID = window.parent.location.pathname.split('/').pop();
console.log(projectUUID);

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function getProject() {
    const req = await fetch(`/api/projects/get?projectUUID=${projectUUID}&userUUID=${userUUID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('sb-access-token')}`
        }
    });

    if (!req.ok) {
        if (req.status === 403) {
            window.location.replace('/app/auth');
        } else {
            throw new Error(req.statusText);
        }
    }

    const res = await req.json();

    return res[0];
}

async function loadProject() {
    const project = await getProject();
    document.getElementById('projectName').textContent = project.name;
    document.getElementById('projectRepo').textContent = project.repo;
}
loadProject();