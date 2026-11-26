import plan from "./folionix-plan.json";

/**
 * Parts of the work plan that are my own preparation rather than engineering work on Folionix: the machine setup,
 * the CV and the job search and interview practice. They stay in the admin tracker but are left off the public page,
 * and out of its progress numbers.
 */
export const PRIVATE_GROUPS = new Set(["g0", "g14"]);
export const PRIVATE_TASKS = new Set(["F-78"]);

export const isPrivateTask = (t: { id: string; group: string }) => PRIVATE_GROUPS.has(t.group) || PRIVATE_TASKS.has(t.id);

export const publicGroups = plan.groups.filter((g) => !PRIVATE_GROUPS.has(g.id));
export const publicTasks = plan.tasks.filter((t) => !isPrivateTask(t));

/** The 24 major drills (S-1 to S-24): listed under "Drill reports", not in the work plan. */
export const MAJOR = "gS";
export const majorDrills = publicTasks.filter((t) => t.group === MAJOR);
/** The work plan below them: everything else. */
export const workPlanGroups = publicGroups.filter((g) => g.id !== MAJOR);
