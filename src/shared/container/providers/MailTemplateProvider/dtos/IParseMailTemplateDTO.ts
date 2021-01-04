// Below I create an interface that will tell that my "variables" for the DTO
// to accept any object with a key that is a string and the content that can be
// both string or number
interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
