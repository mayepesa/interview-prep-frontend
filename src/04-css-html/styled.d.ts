import "styled-components";

// Tipa el tema de styled-components: p.theme.radius deja de ser `any`.
declare module "styled-components" {
  export interface DefaultTheme {
    radius: string;
    accent: string;
    danger: string;
  }
}
