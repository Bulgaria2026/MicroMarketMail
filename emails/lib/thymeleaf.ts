// Thymeleaf attribute-bag helpers.
// JSX forbids `:` in attribute names, so `th:text` etc. have to arrive via spread.
// These helpers keep that syntax contained and make templates read like plain React.
export const thText = (expr: string) => ({ "th:text": expr });
export const thEach = (expr: string) => ({ "th:each": expr });
export const thIf = (expr: string) => ({ "th:if": expr });
export const thRemove = () => ({ "th:remove": "all" });
