import {translations,type Language,type Strings} from "./translations";
export function getStrings(language:Language):Strings{return translations[language];}
