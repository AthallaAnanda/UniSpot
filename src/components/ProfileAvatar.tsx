import "./ProfileAvatar.css";

export default function ProfileAvatar({ large = false }: { name: string; large?: boolean }) {
  return <span className={`profile-avatar-mark${large ? " profile-avatar-mark-large" : ""}`} aria-hidden="true"><svg viewBox="0 0 100 100" fill="currentColor"><ellipse cx="33" cy="53" rx="2.5" ry="2.7" /><ellipse cx="48" cy="53" rx="2.5" ry="2.7" /><path d="M34 72c4 1.5 9 1.5 13 0 1.5-.5 2 .5 1.5 2.2-1 3.4-3.5 5.8-8 5.8s-7-2.4-8-5.8c-.5-1.7 0-2.7 1.5-2.2Z" /></svg></span>;
}
