import pandas as pd
import matplotlib.pyplot as plt

class ProcessData:
    def __init__ (self, dataframe):
        self.df = dataframe

    def process_outliers(self):
        self.df['NU_PARAM_B'] = self.df['NU_PARAM_B'].clip(upper=4)

    def process_percentiles(self):
        percentile = self.df['NU_PARAM_B'].quantile([0, 0.2, 0.4, 0.6, 0.8, 1]).values
        print('Percentis de NU_PARAM_B:')
        for i, p in enumerate(percentile):
            print(f'Percentil {i * 20}: {p}')
        return percentile

    def analyze_processed_difficulty_levels(self):
        plt.hist(self.df['NU_PARAM_B'], bins=30, edgecolor='black')
        plt.xlabel('NU_PARAM_B')
        plt.ylabel('Frequência')
        plt.title('Distribuição dos níveis de dificuldade')
        plt.show()
    
    def categorize_level(self, value, percentiles):
        if value <= percentiles[1]:
            return 1
        elif value <= percentiles[2]:
            return 2
        elif value <= percentiles[3]:
            return 3
        elif value <= percentiles[4]:
            return 4
        else:
            return 5

    def process_and_save_levels(self, percentiles, output_path):
        self.df['NU_PARAM_B'] = self.df['NU_PARAM_B'].apply(lambda x: self.categorize_level(x, percentiles))
        self.df.to_csv(output_path, index=False)
        print(f'Arquivo salvo em: {output_path}')

    def merge_dataframes(self):
        df_niveis = pd.read_csv('ITENS_PROVA_PROCESSADOS.csv', sep=',')
        df_questoes = pd.read_csv('enem2024_dia1_azul.csv', sep=';')

        df_niveis['TP_LINGUA'] = df_niveis['TP_LINGUA'].fillna('').astype(str)
        df_questoes['TP_LINGUA'] = df_questoes['TP_LINGUA'].fillna('').astype(str)

        drop_cols = []
        for c in ('NU_PARAM_B', 'CO_HABILIDADE', 'SG_AREA'):
            if c in df_questoes.columns:
                drop_cols.append(c)
        if drop_cols:
            df_questoes = df_questoes.drop(columns=drop_cols)

        
        df_final = pd.merge(
            df_questoes,
            df_niveis[['CO_PROVA', 'CO_POSICAO', 'TP_LINGUA', 'NU_PARAM_B', 'CO_HABILIDADE', 'SG_AREA']],
            on=['CO_PROVA', 'CO_POSICAO', 'TP_LINGUA'],
            how='left'
        )
        df_final.to_csv('ITENS_PROVA_FINAL.csv', index=False)
        print('DataFrames mesclados e salvos em ITENS_PROVA_FINAL.csv')
        return df_final

    def merge_with_area_data(self, area_csv_path, output_path='ITENS_PROVA_FINAL.csv', area_sep=';'):
        df_final = self.merge_dataframes()

        area_df = pd.read_csv(area_csv_path, sep=area_sep)

        required_keys = ('SG_AREA', 'CO_HABILIDADE')
        if not all(k in area_df.columns for k in required_keys):
            raise ValueError(f"area_csv_path deve conter as colunas: {', '.join(required_keys)}")

        wanted = ['SG_AREA', 'CO_HABILIDADE', 'COMPETENCIA', 'DS_HABILIDADE']
        available = [c for c in wanted if c in area_df.columns]
        area_sub = area_df[available].copy()

        for col in ('SG_AREA', 'CO_HABILIDADE'):
            area_sub[col] = area_sub[col].fillna('').astype(str)
            if col in df_final.columns:
                df_final[col] = df_final[col].fillna('').astype(str)

        df_merged = pd.merge(df_final, area_sub, on=['SG_AREA', 'CO_HABILIDADE'], how='left')

        df_merged.to_csv(output_path, index=False)
        print(f'DataFrames mesclados com area_df e salvos em {output_path}')
        return df_merged
    