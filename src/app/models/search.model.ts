export interface ISearchResult
{
    name: string;
    owner: {
        name: string;
        url: string;
    };
    url: string;
    description: string;
    stars: number;
    homepage: string;
}