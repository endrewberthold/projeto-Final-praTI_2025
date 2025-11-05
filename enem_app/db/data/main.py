import pandas as pd
from process_data import ProcessData
from analyze_data import DataAnalysis
import matplotlib.pyplot as plt


def main():
    df = pd.read_csv('ITENS_PROVA.csv', sep=';')
    data_analysis = DataAnalysis(df)
    process_data = ProcessData(df)

    data_analysis.analyze_difficulty_levels()

    process_data.process_outliers()
    percentiles = process_data.process_percentiles()

    process_data.analyze_processed_difficulty_levels()

    process_data.process_and_save_levels(percentiles, 'ITENS_PROVA_PROCESSADOS.csv')

    df_processado = pd.read_csv('ITENS_PROVA_PROCESSADOS.csv', sep=',')
    ProcessData(df_processado).analyze_processed_difficulty_levels()

    process_data.merge_dataframes()
    process_data.merge_with_area_data('habilidades_map.csv', 'ITENS_PROVA_FINAL_COM_AREA.csv')

if __name__ == "__main__":
    main()