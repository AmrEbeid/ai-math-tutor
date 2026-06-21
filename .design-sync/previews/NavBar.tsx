import { NavBar } from '@zeluu/design-system';

export const Default = () => (
  <NavBar
    brand="Zeluu"
    logo={<span style={{ fontSize: 20 }}>📚</span>}
    actions={
      <a className="nav-signin" href="#">
        Sign in
      </a>
    }
  />
);
